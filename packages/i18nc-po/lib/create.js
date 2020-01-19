'use strict';

const _ = require('lodash');
const PO = require('pofile');
const debug = require('debug')('i18nc-po:create');
const deprecate = require('depd')('i18nc-po:create');
const refsUtils = require('./refs_utils');
const ArrayPush = Array.prototype.push;

const CONTENT_HEADERS = {
	title: 'Project-Id-Version',
	email: 'Report-Msgid-Bugs-To'
};

exports.defaults = {
	email: undefined,
	title: 'I18N Project - Create By I18NC Tool',
	// 针对已有翻译数据的筛选
	// ignore  不打包
	// keep    将内容打包到文件
	// empty   清空翻译内容输出
	existedTranslateFilter: 'ignore',
	onlyTheseLanguages: []
};

exports.create = create;
function create(json, options) {
	if (
		options &&
		!('onlyTheseLanguages' in options) &&
		'pickFileLanguages' in options
	) {
		options.onlyTheseLanguages = options.pickFileLanguages;
		deprecate('use `onlyTheseLanguages` instead of `pickFileLanguages`');
	}
	_.each(exports.defaults, function(val, key) {
		if (!options[key]) options[key] = val;
	});

	let onlyTheseLanguages = options.onlyTheseLanguages;
	if (!onlyTheseLanguages || !onlyTheseLanguages.length) {
		onlyTheseLanguages = json.allFuncLans();
		ArrayPush.apply(onlyTheseLanguages, json.allUsedLans());
	}

	debug('lans:%o', onlyTheseLanguages);

	const result = { po: {} };
	if (onlyTheseLanguages && onlyTheseLanguages.length) {
		_.each(onlyTheseLanguages, function(lan) {
			const items = filterTranslateWords(
				json,
				lan,
				options.existedTranslateFilter
			);
			result.po[lan] = json2pot(items, lan, options);
		});
	}

	const items = filterTranslateWords(json, null, 'ignore');
	result.pot = json2pot(items, null, options);

	return result;
}

function filterTranslateWords(json, lan, existedTranslateFilter) {
	if (!json) json = {};

	const fileKey = json.currentFileKey;
	const items = {};
	const words = json.words || {};
	const codeTranslateWords =
		(words.codeTranslateWords && words.codeTranslateWords.toJSON()) || {};
	let usedTranslateWords =
		(words.usedTranslateWords && words.usedTranslateWords.toJSON()) || {};
	usedTranslateWords = usedTranslateWords[lan] || {};

	const usedTranslateWordsDEFAULTS = usedTranslateWords.DEFAULTS || {};
	const usedTranslateWordsSUBKEYS = usedTranslateWords.SUBKEYS || {};

	debug(
		'DEFAULT, codeTranslateWords:%o, usedTranslateWords:%o, code:%s',
		codeTranslateWords.DEFAULTS,
		usedTranslateWordsDEFAULTS,
		json.code
	);
	_.each(codeTranslateWords.DEFAULTS, function(msgid) {
		let msgstr = usedTranslateWordsDEFAULTS[msgid];
		if (msgstr !== undefined) {
			if (existedTranslateFilter == 'ignore') return;
			else if (existedTranslateFilter == 'empty') msgstr = undefined;
		}

		const key = msgid + ':' + msgstr;
		debug('lan:%s msgid:%s msgstr:%s', lan, msgid, msgstr);
		const item = items[key] || (items[key] = new TPOItem(msgid, msgstr));
		item.addKeyInfo(refsUtils.genOnlyFileKey(fileKey));
	});

	// 处理subkeyList
	const lineSubkeyList = {};
	let hasLineSubkey = false;
	_.each(codeTranslateWords.SUBKEYS, function(words, subkey) {
		const usedWordsInfo = usedTranslateWordsSUBKEYS[subkey] || {};

		// 创建line subkey
		// 这里先做收集
		if (subkey[0] == ':') {
			hasLineSubkey = true;
			const mainSubkey = subkey.split('@')[0];
			const arr =
				lineSubkeyList[mainSubkey] || (lineSubkeyList[mainSubkey] = []);
			arr.push(subkey);
		}
		// 普通的subkey
		else {
			words.forEach(function(msgid) {
				let msgstr = usedWordsInfo[msgid];
				if (msgstr !== undefined) {
					if (existedTranslateFilter == 'ignore') return;
					else if (existedTranslateFilter == 'empty')
						msgstr = undefined;
				}

				const key = msgid + ':' + msgstr;
				debug('lan:%s msgid:%s msgstr:%s', lan, msgid, msgstr);
				const item =
					items[key] || (items[key] = new TPOItem(msgid, msgstr));
				item.addKeyInfo(refsUtils.genSimpleSubkey(fileKey, subkey));
			});
		}
	});

	// 处理line subkey
	if (hasLineSubkey) {
		const subkeyAstMap = {};
		words.codeTranslateWords.list.forEach(function(item) {
			if (item.type != 'subkey') return;
			const arr =
				subkeyAstMap[item.subkey] || (subkeyAstMap[item.subkey] = []);
			arr.push(item);
		});

		_.each(lineSubkeyList, function(subkeyList, mainSubkey) {
			const isDiff = _.some(subkeyList, function(subkey) {
				const usedWordsInfo = usedTranslateWordsSUBKEYS[subkey] || {};
				const usedWordsArr = Object.keys(usedWordsInfo);
				const allWordsItemArr = subkeyAstMap[subkey];

				if (usedWordsArr.length != allWordsItemArr.length) return true;

				const allWordsArr = allWordsItemArr.map(function(item) {
					return item.value;
				});

				return !!_.difference(usedWordsArr, allWordsArr).length;
			});

			debug('isDiff:%s', isDiff);

			// 忽略不写入到生成队列中
			if (!isDiff && existedTranslateFilter == 'ignore') return;

			const msgidArr = [];
			const msgstrArr = [];
			const msgidSubkeyItmes = [];
			const mySubkeyAstMap = [];
			let hasSubkeys = false;
			_.map(subkeyList, function(subkey) {
				ArrayPush.apply(mySubkeyAstMap, subkeyAstMap[subkey]);
			});

			mySubkeyAstMap
				.sort(function(a, b) {
					return a.originalAst.range[0] > b.originalAst.range[0]
						? 1
						: -1;
				})
				.forEach(function(item) {
					const val = item.translateWord;
					msgidArr.push(val);
					const subkey = item.subkey
						.split('@')
						.slice(1)
						.join('@');
					if (subkey) hasSubkeys = true;
					msgidSubkeyItmes.push({ msg: val, subkey: subkey });

					if (!isDiff) {
						const myMsgid =
							usedTranslateWordsSUBKEYS[item.subkey] &&
							usedTranslateWordsSUBKEYS[item.subkey][item.value];
						msgstrArr.push(myMsgid);
					}
				});

			const msgid = msgidArr.join('%s');
			const msgstr =
				!isDiff && existedTranslateFilter != 'empty'
					? msgstrArr.join('%s')
					: undefined;

			const key = msgid + ':' + msgstr;
			debug('lan:%s msgid:%s msgstr:%s', lan, msgid, msgstr);
			const item = items[key] || (items[key] = new TPOItem(msgid, msgstr));
			const fileInfo = hasSubkeys
				? refsUtils.genLineSubkey(fileKey, mainSubkey, msgidSubkeyItmes)
				: refsUtils.genSimpleLineSubkey(fileKey, mainSubkey, msgidArr);
			item.addKeyInfo(fileInfo);
		});
	}

	_.each(json.subScopeDatas, function(json) {
		const ret = filterTranslateWords(json, lan, existedTranslateFilter);
		_.each(ret, function(item, msgid) {
			if (items[msgid]) items[msgid].merge(item);
			else items[msgid] = item;
		});
	});

	debug(
		'get words, subScopeDatas:%d, item:%o',
		json.subScopeDatas && json.subScopeDatas.length,
		items
	);

	return items;
}

function json2pot(items, lan, options) {
	const poInfo = new PO();

	// 设置文件头部信息
	['title', 'email'].forEach(function(key) {
		const val = options[key];
		if (val) {
			poInfo.headers[CONTENT_HEADERS[key]] = val;
		}
	});

	poInfo.headers['Content-Type'] = 'text/plain; charset=UTF-8';
	poInfo.headers['Content-Transfer-Encoding'] = '8bit';
	poInfo.headers['MIME-Versio'] = '1.0';
	poInfo.headers['X-Generator'] = 'I18NC-PO';

	if (lan) poInfo.headers['Language'] = lan;

	poInfo.comments.push('Create by I18NC PO');

	poInfo.items = _(items)
		.values()
		.map(function(item) {
			return item.toPOItem();
		})
		.sort(function(a, b) {
			if (a.msgid == b.msgid) {
				if (a.msgstr == b.msgstr) {
					return a.references.length > b.references.length ? 1 : -1;
				} else {
					return a.msgstr > b.msgstr ? 1 : -1;
				}
			} else {
				return a.msgid > b.msgid ? 1 : -1;
			}
		})
		.value();

	return poInfo.toString();
}

function TPOItem(msgid, msgstr) {
	this.msgid = msgid;
	this.msgstr = msgstr;
	this.fileInfos = {};
}

_.extend(TPOItem.prototype, {
	toPOItem: function() {
		const item = new PO.Item();
		item.msgid = this.msgid;
		if (this.msgstr !== undefined) item.msgstr = this.msgstr;
		item.references = _.map(this.fileInfos, function(num, fileInfo) {
			return '@@' + fileInfo;
		}).sort();

		if (item.references.length == 1 && item.references[0] == '@@0,*') {
			item.references = [];
		}

		debug('item references:%o', item.references);

		return item;
	},
	addKeyInfo: function(fileInfo) {
		if (!this.fileInfos[fileInfo]) {
			this.fileInfos[fileInfo] = 0;
		}

		this.fileInfos[fileInfo]++;
	},
	merge: function(item) {
		const self = this;
		_.each(item.fileInfos, function(num, fileInfo) {
			self.addKeyInfo(fileInfo);
		});
	}
});

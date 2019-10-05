'use strict';

var _         = require('lodash');
var PO        = require('pofile');
var debug     = require('debug')('i18nc-po:create');
var deprecate = require('depd')('i18nc-po:create');
var refsUtils = require('./refs_utils');
var ArrayPush = Array.prototype.push;

var CONTENT_HEADERS =
{
	title: 'Project-Id-Version',
	email: 'Report-Msgid-Bugs-To',
};

exports.defaults =
{
	email: undefined,
	title: 'I18N Project - Create By I18NC Tool',
	// 针对已有翻译数据的筛选
	// ignore  不打包
	// keep    将内容打包到文件
	// empty   清空翻译内容输出
	existedTranslateFilter: 'ignore',
	onlyTheseLanguages: [],
};


exports.create = create;
function create(json, options)
{
	if (options
		&& !('onlyTheseLanguages' in options)
		&& 'pickFileLanguages' in options)
	{
		options.onlyTheseLanguages = options.pickFileLanguages;
		deprecate('use `onlyTheseLanguages` instead of `pickFileLanguages`');
	}
	_.each(exports.defaults, function(val, key)
	{
		if (!options[key]) options[key] = val;
	});


	var onlyTheseLanguages = options.onlyTheseLanguages;
	if (!onlyTheseLanguages || !onlyTheseLanguages.length)
	{
		onlyTheseLanguages = json.allFuncLans();
		ArrayPush.apply(onlyTheseLanguages, json.allUsedLans());
	}

	debug('lans:%o', onlyTheseLanguages);

	var result = {po: {}};
	if (onlyTheseLanguages && onlyTheseLanguages.length)
	{
		_.each(onlyTheseLanguages, function(lan)
		{
			var items = filterTranslateWords(json, lan, options.existedTranslateFilter);
			result.po[lan] = json2pot(items, lan, options);
		});
	}

	var items = filterTranslateWords(json, null, 'ignore');
	result.pot = json2pot(items, null, options);

	return result;
}

function filterTranslateWords(json, lan, existedTranslateFilter)
{
	if (!json) json = {};

	var fileKey = json.currentFileKey;
	var items = {};
	var words = json.words || {};
	var codeTranslateWords = words.codeTranslateWords && words.codeTranslateWords.toJSON() || {};
	var usedTranslateWords = words.usedTranslateWords && words.usedTranslateWords.toJSON() || {};
	usedTranslateWords = usedTranslateWords[lan] || {};

	var usedTranslateWordsDEFAULTS = usedTranslateWords.DEFAULTS || {};
	var usedTranslateWordsSUBTYPES = usedTranslateWords.SUBTYPES || {};

	debug('DEFAULT, codeTranslateWords:%o, usedTranslateWords:%o, code:%s',
		codeTranslateWords.DEFAULTS,
		usedTranslateWordsDEFAULTS,
		json.code);
	_.each(codeTranslateWords.DEFAULTS, function(msgid)
	{
		var msgstr = usedTranslateWordsDEFAULTS[msgid];
		if (msgstr !== undefined)
		{
			if (existedTranslateFilter == 'ignore') return;
			else if (existedTranslateFilter == 'empty') msgstr = undefined;
		}

		var key = msgid+':'+msgstr;
		debug('lan:%s msgid:%s msgstr:%s', lan, msgid, msgstr);
		var item = items[key] || (items[key] = new TPOItem(msgid, msgstr));
		item.addKeyInfo(refsUtils.genOnlyFileKey(fileKey));
	});


	// 处理subtypeList
	var lineSubtypeList = {};
	var hasLineSubtype = false;
	_.each(codeTranslateWords.SUBTYPES, function(words, subtype)
	{
		var usedWordsInfo = usedTranslateWordsSUBTYPES[subtype] || {};

		// 创建line subtype
		// 这里先做收集
		if (subtype[0] == ':')
		{
			hasLineSubtype = true;
			var mainSubtype = subtype.split('@')[0];
			var arr = lineSubtypeList[mainSubtype] || (lineSubtypeList[mainSubtype] = []);
			arr.push(subtype);
		}
		// 普通的subtype
		else
		{
			words.forEach(function(msgid)
			{
				var msgstr = usedWordsInfo[msgid];
				if (msgstr !== undefined)
				{
					if (existedTranslateFilter == 'ignore') return;
					else if (existedTranslateFilter == 'empty') msgstr = undefined;
				}

				var key = msgid+':'+msgstr;
				debug('lan:%s msgid:%s msgstr:%s', lan, msgid, msgstr);
				var item = items[key] || (items[key] = new TPOItem(msgid, msgstr));
				item.addKeyInfo(refsUtils.genSimpleSubtype(fileKey, subtype));
			});
		}
	});

	// 处理line subtype
	if (hasLineSubtype)
	{
		var subtypeAstMap = {};
		words.codeTranslateWords.list.forEach(function(item)
		{
			if (item.type != 'subtype') return;
			var arr = subtypeAstMap[item.subtype] || (subtypeAstMap[item.subtype] = []);
			arr.push(item);
		});

		_.each(lineSubtypeList, function(subtypeList, mainSubtype)
		{
			var isDiff = _.some(subtypeList, function(subtype)
				{
					var usedWordsInfo = usedTranslateWordsSUBTYPES[subtype] || {};
					var usedWordsArr = Object.keys(usedWordsInfo);
					var allWordsItemArr = subtypeAstMap[subtype];

					if (usedWordsArr.length != allWordsItemArr.length) return true;

					var allWordsArr = allWordsItemArr.map(function(item){return item.value});

					return !!_.difference(usedWordsArr, allWordsArr).length;
				});

			debug('isDiff:%s', isDiff);

			// 忽略不写入到生成队列中
			if (!isDiff && existedTranslateFilter == 'ignore') return;

			var msgidArr = [];
			var msgstrArr = [];
			var msgidSubkeyItmes = [];
			var mySubtypeAstMap = [];
			var hasSubkeys = false;
			_.map(subtypeList, function(subtype)
			{
				ArrayPush.apply(mySubtypeAstMap, subtypeAstMap[subtype]);
			});

			mySubtypeAstMap.sort(function(a, b)
				{
					return a.originalAst.range[0] > b.originalAst.range[0] ? 1 : -1;
				})
				.forEach(function(item)
				{
					var val = item.translateWord;
					msgidArr.push(val);
					var subkey = item.subtype.split('@').slice(1).join('@');
					if (subkey) hasSubkeys = true;
					msgidSubkeyItmes.push({msg: val, subkey: subkey});

					if (!isDiff)
					{
						var myMsgid = usedTranslateWordsSUBTYPES[item.subtype]
								&& usedTranslateWordsSUBTYPES[item.subtype][item.value];
						msgstrArr.push(myMsgid);
					}
				});

			var msgid = msgidArr.join('%s');
			var msgstr = !isDiff && existedTranslateFilter != 'empty' ? msgstrArr.join('%s') : undefined;

			var key = msgid+':'+msgstr;
			debug('lan:%s msgid:%s msgstr:%s', lan, msgid, msgstr);
			var item = items[key] || (items[key] = new TPOItem(msgid, msgstr));
			var fileInfo = hasSubkeys
				? refsUtils.genLineSubtype(fileKey, mainSubtype, msgidSubkeyItmes)
				: refsUtils.genSimpleLineSubtype(fileKey, mainSubtype, msgidArr);
			item.addKeyInfo(fileInfo);
		});
	}

	_.each(json.subScopeDatas, function(json)
	{
		var ret = filterTranslateWords(json, lan, existedTranslateFilter);
		_.each(ret, function(item, msgid)
		{
			if (items[msgid])
				items[msgid].merge(item);
			else
				items[msgid] = item;
		});
	});

	debug('get words, subScopeDatas:%d, item:%o',
		json.subScopeDatas && json.subScopeDatas.length, items);

	return items;
}


function json2pot(items, lan, options)
{
	var poInfo = new PO();

	// 设置文件头部信息
	['title', 'email'].forEach(function(key)
	{
		var val = options[key];
		if (val)
		{
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
		.map(function(item)
		{
			return item.toPOItem();
		})
		.sort(function(a, b)
		{
			if (a.msgid == b.msgid)
			{
				if (a.msgstr == b.msgstr)
				{
					return a.references.length > b.references.length ? 1 : -1;
				}
				else
				{
					return a.msgstr > b.msgstr ? 1 : -1;
				}
			}
			else
			{
				return a.msgid > b.msgid ? 1 : -1;
			}
		})
		.value();

	return poInfo.toString();
}


function TPOItem(msgid, msgstr)
{
	this.msgid = msgid;
	this.msgstr = msgstr;
	this.fileInfos = {};
}

_.extend(TPOItem.prototype,
{
	toPOItem: function()
	{
		var item = new PO.Item();
		item.msgid = this.msgid;
		if (this.msgstr !== undefined) item.msgstr = this.msgstr;
		item.references = _.map(this.fileInfos, function(num, fileInfo)
			{
				return '@@'+fileInfo;
			})
			.sort();

		if (item.references.length == 1 && item.references[0] == '@@0,*')
		{
			item.references = [];
		}

		debug('item references:%o', item.references);

		return item;
	},
	addKeyInfo: function(fileInfo)
	{
		if (!this.fileInfos[fileInfo])
		{
			this.fileInfos[fileInfo] = 0;
		}

		this.fileInfos[fileInfo]++;
	},
	merge: function(item)
	{
		var self = this;
		_.each(item.fileInfos, function(num, fileInfo)
		{
			self.addKeyInfo(fileInfo);
		});
	}
});

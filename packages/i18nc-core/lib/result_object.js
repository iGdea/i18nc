'use strict';

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:result_obj');
var extend			= require('extend');
var i18ncAst		= require('i18nc-ast');
var astUtil			= i18ncAst.util;
var AST_FLAGS		= i18ncAst.AST_FLAGS;
var ArrayPush		= Array.prototype.push;
var ArrayConcat		= Array.prototype.concat;


exports.DirtyWords = DirtyWords;
exports.TranslateWords = TranslateWords;
exports.CodeInfoResult = CodeInfoResult;
exports.CodeTranslateWords = CodeTranslateWords;

var FuncTranslateWords = exports.FuncTranslateWords = FileKeyTranslateWords;
var UsedTranslateWords = exports.UsedTranslateWords = FileKeyTranslateWords;

function DirtyWords(list)
{
	this.list = list || [];
}

_.extend(DirtyWords.prototype,
{
	add: function(ast, reason)
	{
		this.list.push(
		{
			code		: astUtil.tocode(ast),
			reason		: reason,
			originalAst	: ast,
		});
	},
	/**
	 * 转换成数组
	 *
	 * @return {Array} [源码片段]
	 */
	toArray: function()
	{
		return this.list.map(function(item)
		{
			return item.code;
		});
	},
	/**
	 * 输出JSON格式的结果
	 *
	 * @return {Object}
	 */
	toJSON: function()
	{
		return this.toArray();
	},
	/**
	 * 拷贝
	 *
	 * @return {DirtyWords}
	 */
	clone: function()
	{
		return new DirtyWords(this.list.slice());
	},
	/**
	 * 合并数据
	 *
	 * @param  {DirtyWords} dirtyWords
	 */
	merge: function(dirtyWords)
	{
		ArrayPush.apply(this.list, dirtyWords.list);
	}
});


function CodeTranslateWords(list)
{
	this.list = list || [];
}

_.extend(CodeTranslateWords.prototype,
{
	/**
	 * 输出JSON格式的结果
	 *
	 * @return {Object}
	 */
	toJSON: function()
	{
		var DEFAULTS = [];
		var SUBTYPES = {};

		// 排序，保证数组是按照code先后顺序生成
		this.list.sort(function(a, b)
		{
			return a.originalAst.range[0] > b.originalAst.range[0] ? 1 : -1;
		})
		.forEach(function(item)
		{
			switch (item.type)
			{
				case 'new':
					ArrayPush.apply(DEFAULTS, item.translateWords);
					break;

				case 'subtype':
					var arr = SUBTYPES[item.subtype] || (SUBTYPES[item.subtype] = []);
					arr.push(item.translateWord);
					break;

				case 'wraped':
					DEFAULTS.push(item.translateWord);
					break;
			}
		});

		return {
			DEFAULTS: DEFAULTS,
			SUBTYPES: SUBTYPES,
		};
	},
	/**
	 * 拷贝
	 *
	 * @return {CodeTranslateWords}
	 */
	clone: function()
	{
		return new CodeTranslateWords(this.list.slice());
	},
	/**
	 * 合并数据
	 *
	 * @param  {CodeTranslateWords} codeTranslateWords
	 */
	merge: function(codeTranslateWords)
	{
		ArrayPush.apply(this.list, codeTranslateWords.list);
	},
	/**
	 * 输出所有需要翻译的词条
	 *
	 * @return {String}
	 */
	allwords: function()
	{
		var result = [];

		this.list.sort(function(a, b)
		{
			return a.originalAst.range[0] > b.originalAst.range[0] ? 1 : -1;
		})
		.forEach(function(item)
		{
			switch (item.type)
			{
				case 'new':
					ArrayPush.apply(result, item.translateWords);
					break;

				case 'subtype':
				case 'wraped':
					result.push(item.translateWord);
					break;
			}
		});

		return result;
	},
	/**
	 * 输出所有需要翻译的新词条
	 *
	 * @return {Ast}
	 */
	list4newWordAsts: function()
	{
		return this.list.filter(function(item)
			{
				return item.type == 'new';
			});
	},
	/**
	 * 输出所有没有包裹的需要翻译的新词条
	 *
	 * @return {Ast}
	 */
	list4nowrappedWordAsts: function()
	{
		return this.list.filter(function(item)
			{
				return item.type == 'new'
					&& !astUtil.checkAstFlag(item.originalAst, AST_FLAGS.SKIP_REPLACE | AST_FLAGS.DIS_REPLACE);
			});
	},
	/**
	 * 输出所有需要翻译的新词条
	 *
	 * @return {String}
	 */
	list4newWords: function()
	{
		var arrs = this.list4newWordAsts().map(function(item)
			{
				return item.translateWords;
			});
		return ArrayConcat.apply([], arrs);
	},
	/**
	 * 输出所有没有包裹的需要翻译的新词条
	 *
	 * @return {String}
	 */
	list4nowrappedWords: function()
	{
		var arrs = this.list4nowrappedWordAsts().map(function(item)
			{
				return item.translateWords;
			});
		return ArrayConcat.apply([], arrs);
	},
	pushNewWord: function(ast)
	{
		this.list.push(
		{
			type           : 'new',
			originalAst    : ast,
			translateWords : ast.__i18n_replace_info__.translateWords
		});
	},
	pushSubtype: function(subtype, ast)
	{
		this.list.push(
		{
			type          : 'subtype',
			originalAst   : ast,
			subtype       : subtype,
			translateWord : astUtil.ast2constVal(ast),
		});
	},
	pushWraped: function(ast)
	{
		this.list.push(
		{
			type          : 'wraped',
			originalAst   : ast,
			translateWord : astUtil.ast2constVal(ast),
		});
	}
});


function FileKeyTranslateWords(list)
{
	this.list = list || [];
}

_.extend(FileKeyTranslateWords.prototype,
{
	add: function(fileKey, json)
	{
		this.list.push({fileKey: fileKey, data: json || {}});
	},
	/**
	 * 输出JSON格式的结果
	 *
	 * @return {Object}
	 */
	toJSON: function()
	{
		var arrs = this.list.map(function(item)
		{
			return item.data;
		});

		arrs.unshift(true, {});
		return extend.apply(null, arrs);
	},
	/**
	 * 拷贝
	 *
	 * @return {FileKeyTranslateWords}
	 */
	clone: function()
	{
		return new FileKeyTranslateWords(this.list.slice());
	},
	/**
	 * 合并数据
	 *
	 * @param  {FileKeyTranslateWords} fileKeyTranslateWords
	 */
	merge: function(fileKeyTranslateWords)
	{
		ArrayPush.apply(this.list, fileKeyTranslateWords.list);
	},
	/**
	 * 输出解析到的语种
	 *
	 * @return {Array}
	 */
	lans: function()
	{
		var lanArrs = this.list.map(function(item)
		{
			return Object.keys(item.data);
		});

		return _.uniq(ArrayConcat.apply([], lanArrs));
	},
	words: function(lan)
	{
		var data = this.toJSON();
		var SUBTYPES = {};
		if (lan)
		{
			var json = data[lan] || {};
			_.each(json.SUBTYPES, function(obj, subtype)
			{
				SUBTYPES[subtype] = Object.keys(obj);
			});

			return {
				DEFAULTS: json.DEFAULTS && Object.keys(json.DEFAULTS) || [],
				SUBTYPES: SUBTYPES,
			};
		}

		var DEFAULTS = [];
		_.each(data, function(json)
		{
			ArrayPush.apply(DEFAULTS, json.DEFAULTS && Object.keys(json.DEFAULTS) || []);
			_.each(json.SUBTYPES, function(obj, subtype)
			{
				var arr = SUBTYPES[subtype];
				if (arr)
				{
					ArrayPush.apply(arr, Object.keys(obj));
					SUBTYPES[subtype] = _.uniq(arr);
				}
				else
				{
					SUBTYPES[subtype] = Object.keys(obj);
				}
			});
		});

		return {
			DEFAULTS: _.uniq(DEFAULTS),
			SUBTYPES: SUBTYPES,
		};
	},
});



function TranslateWords(codeTranslateWords, funcTranslateWords, usedTranslateWords)
{
	// 从代码中获取到的关键字
	this.codeTranslateWords = codeTranslateWords instanceof CodeTranslateWords
		? codeTranslateWords : new CodeTranslateWords(codeTranslateWords);
	// 从i18n函数中解出来的翻译数据 数据带filekey
	this.funcTranslateWords = funcTranslateWords instanceof FuncTranslateWords
		? funcTranslateWords : new FuncTranslateWords(funcTranslateWords);
	// 处理后，正在使用的翻译数据  数据不带filekey
	this.usedTranslateWords = usedTranslateWords instanceof UsedTranslateWords
		? usedTranslateWords : new UsedTranslateWords(usedTranslateWords);
}

_.extend(TranslateWords.prototype,
{
	/**
	 * 输出JSON格式的结果
	 *
	 * @return {Object}
	 */
	toJSON: function()
	{
		return {
			codeTranslateWords: this.codeTranslateWords.toJSON(),
			funcTranslateWords: this.funcTranslateWords.toJSON(),
			usedTranslateWords: this.usedTranslateWords.toJSON(),
		};
	}
});


function CodeInfoResult(data)
{
	var self = this;

	['code', 'currentFileKey', 'originalFileKeys', 'subScopeDatas', 'currentFileKeys']
		.forEach(function(name)
		{
			self[name] = data[name];
		});

	self.dirtyWords = data.dirtyWords instanceof DirtyWords
		? data.dirtyWords : new DirtyWords(data.dirtyWords);

	if (data.words)
	{
		self.words = data.words instanceof TranslateWords
			? data.words : new TranslateWords(
					data.words.codeTranslateWords,
					data.words.funcTranslateWords,
					data.words.usedTranslateWords
				);
	}
	else
	{
		self.words = new TranslateWords();
	}
}

_.extend(CodeInfoResult.prototype,
{
	/**
	 * 输出处理后的源码
	 *
	 * @return {String}
	 */
	toString: function()
	{
		return this.code;
	},
	/**
	 * 输出JSON格式的结果
	 *
	 * @return {Object}
	 */
	toJSON: function()
	{
		var json =
		{
			code             : this.code,
			currentFileKey   : this.currentFileKey,
			originalFileKeys : this.originalFileKeys,
			subScopeDatas    : this.subScopeDatas.map(function(item){return item.toJSON()}),
			dirtyWords       : this.dirtyWords.toArray(),
			words            : this.words.toJSON(),
		};

		if (this.currentFileKeys) json.currentFileKeys = this.currentFileKeys;

		return json;
	},
	/**
	 * 输出汇集所有子域结果后的最终结果
	 *
	 * @return {CodeInfoResult}
	 */
	squeeze: function()
	{
		var lans = this.allFuncLans();
		ArrayPush.apply(lans, this.allUsedLans());
		lans = _.uniq(lans);
		debug('alllans:%o', lans);

		return new CodeInfoResult(
		{
			code             : this.code,
			lans             : lans,
			currentFileKey   : this.currentFileKey,
			currentFileKeys  : this.allCurrentFileKeys(),
			originalFileKeys : this.allOriginalFileKeys(),
			subScopeDatas    : [],
			dirtyWords       : this.allDirtyWords(),
			words: new TranslateWords(
				this.allCodeTranslateWords(),
				this.allFuncTranslateWords(),
				this.allUsedTranslateWords()),
		});
	},
	/**
	 * 输出所有I18N函数解析结果中使用的翻译语种
	 *
	 * @return {Array}
	 */
	allFuncLans: function()
	{
		var self = this;
		var result = self.words.funcTranslateWords.lans();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.words.funcTranslateWords.lans());
		});

		return _.uniq(result);
	},
	/**
	 * 输出所有当前使用的翻译语种
	 *
	 * @return {Array}
	 */
	allUsedLans: function()
	{
		var self = this;
		var result = self.words.usedTranslateWords.lans();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.words.usedTranslateWords.lans());
		});

		return _.uniq(result);
	},
	/**
	 * 输出所有源码中获取到的需要翻译的词组
	 *
	 * @return {CodeTranslateWords}
	 */
	allCodeTranslateWords: function()
	{
		var self = this;
		var result = self.words.codeTranslateWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			result.merge(item.allCodeTranslateWords());
		});

		return result;
	},
	/**
	 * 输出所有I18N函数中解析到的翻译数据
	 *
	 * @return {FileKeyTranslateWords}
	 */
	allFuncTranslateWords: function()
	{
		var self = this;
		var result = self.words.funcTranslateWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			result.merge(item.allFuncTranslateWords());
		});

		return result;
	},
	/**
	 * 输出所有正在使用的翻译数据
	 *
	 * @return {FileKeyTranslateWords}
	 */
	allUsedTranslateWords: function()
	{
		var self = this;
		var result = self.words.usedTranslateWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			result.merge(item.allUsedTranslateWords());
		});

		return result;
	},
	/**
	 * 输出所有正在使用的FileKey
	 *
	 * @return {Array}
	 */
	allCurrentFileKeys: function()
	{
		var self = this;
		var result = [];

		if (self.currentFileKey) result.push(self.currentFileKey);
		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allCurrentFileKeys());
		});

		return result;
	},
	/**
	 * 输出所有解析的FileKey
	 *
	 * @return {Array}
	 */
	allOriginalFileKeys: function()
	{
		var self = this;
		var result = self.originalFileKeys.slice();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allOriginalFileKeys());
		});

		return result;
	},
	/**
	 * 输出所有无法处理的数据
	 *
	 * @return {DirtyWords}
	 */
	allDirtyWords: function()
	{
		var self = this;
		var result = self.dirtyWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			result.merge(item.allDirtyWords());
		});

		return result;
	},
});

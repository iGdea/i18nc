var _				= require('lodash');
var debug			= require('debug')('i18nc-core:result_obj');
var extend			= require('extend');
var escodegen		= require('escodegen');
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
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
			code		: escodegen.generate(ast, optionsUtils.escodegenOptions),
			reason		: reason,
			originalAst	: ast,
		});
	},
	toArray: function()
	{
		return this.list.map(function(item)
		{
			return item.code;
		});
	},
	clone: function()
	{
		return this.list.slice();
	},
});


function CodeTranslateWords(list)
{
	this.list = list || [];
}

_.extend(CodeTranslateWords.prototype,
{
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
	clone: function()
	{
		return this.list.slice();
	},
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
	list4newWordAsts: function()
	{
		return this.list.filter(function(item)
			{
				return item.type == 'new';
			});
	},
	list4newWords: function()
	{
		var arrs = this.list4newWordAsts().map(function(item)
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
			translateWord : astUtils.ast2constVal(ast),
		});
	},
	pushWraped: function(ast)
	{
		this.list.push(
		{
			type          : 'wraped',
			originalAst   : ast,
			translateWord : astUtils.ast2constVal(ast),
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
	toJSON: function()
	{
		var arrs = this.list.map(function(item)
		{
			return item.data;
		});

		arrs.unshift(true, {});
		return extend.apply(null, arrs);
	},
	clone: function()
	{
		return this.list.slice();
	},
	// fileKeyJSON: function()
	// {
	// 	var fileKeys = {};
	// 	_.each(this.list, function(item)
	// 	{
	// 		var arr = fileKeys[item.fileKey] || (fileKeys[item.fileKey] = []);
	// 		arr.push(item.data);
	// 	});
	//
	// 	return fileKeys;
	// },
	lans: function()
	{
		var lanArrs = this.list.map(function(item)
		{
			return Object.keys(item.data);
		});

		return _.uniq(ArrayConcat.apply([], lanArrs));
	}
});



function TranslateWords(codeTranslateWords, funcTranslateWords, usedTranslateWords)
{
	// 从代码中获取到的关键字
	this.codeTranslateWords = codeTranslateWords;
	// 从i18n函数中解出来的翻译数据 数据带filekey
	this.funcTranslateWords = funcTranslateWords;
	// 处理后，正在使用的翻译数据  数据不带filekey
	this.usedTranslateWords = usedTranslateWords;
}

_.extend(TranslateWords.prototype,
{
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
	_.extend(this, data);
}

_.extend(CodeInfoResult.prototype,
{
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
	allCodeTranslateWords: function()
	{
		var self = this;
		var result = self.words.codeTranslateWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allCodeTranslateWords().list);
		});

		return new CodeTranslateWords(result);
	},
	allFuncTranslateWords: function()
	{
		var self = this;
		var result = self.words.funcTranslateWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allFuncTranslateWords().list);
		});

		return new FuncTranslateWords(result);
	},
	allUsedTranslateWords: function()
	{
		var self = this;
		var result = self.words.usedTranslateWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allUsedTranslateWords().list);
		});

		return new UsedTranslateWords(result);
	},
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
	allDirtyWords: function()
	{
		var self = this;
		var result = self.dirtyWords.clone();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allDirtyWords().list);
		});

		return new DirtyWords(result);
	},
});

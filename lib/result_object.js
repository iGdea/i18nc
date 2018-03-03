var _				= require('lodash');
var debug			= require('debug')('i18nc-core:result_obj');
var extend			= require('extend');
var escodegen		= require('escodegen');
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
var ArrayPush		= Array.prototype.push;
var ArrayConcat		= Array.prototype.concat;


exports.DirtyWords = DirtyWords;
exports.CodeTranslateWords = CodeTranslateWords;
exports.FuncTranslateWords = FuncTranslateWords;
exports.UsedTranslateWords = UsedTranslateWords;
exports.TranslateWords = TranslateWords;
exports.CodeInfoResult = CodeInfoResult;


function DirtyWords(list)
{
	this.list || []
}

_.extend(DirtyWords.prototype,
{
	add: function(ast, reason)
	{
		this.list.push(
		{
			ast		: ast,
			code	: escodegen.generate(ast, optionsUtils.escodegenOptions),
			reason	: reason,
		});
	},
	toJSON: function()
	{
		return this.list.map(function(item)
		{
			return item.code;
		});
	}
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


function FuncTranslateWords(list)
{
	this.list = list || [];
}

_.extend(FuncTranslateWords.prototype,
{
	add: function(fileKey, json)
	{
		this.list.push({fileKey: fileKey, data: json});
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


function UsedTranslateWords(data)
{
	this.data = data;
}
_.extend(UsedTranslateWords.prototype,
{
	toJSON: function()
	{
		return this.data;
	},
	lans: function()
	{
		return Object.keys(this.data);
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
		return {
			code             : this.code,
			currentFileKey   : this.currentFileKey,
			originalFileKeys : this.originalFileKeys,
			subScopeDatas    : this.subScopeDatas.map(function(item){return item.toJSON()}),
			dirtyWords       : this.dirtyWords.toJSON(),
			words            : this.words.toJSON(),
		};
	},
	squeeze: function()
	{
		var lans = this.allFuncLans();
		ArrayPush.apply(lans, this.allUsedLans());
		lans = _.uniq(lans);
		debug('alllans:%o', lans);

		return {
			code             : this.code,
			lans             : lans,
			dirtyWords       : this.allDirtyWords(),
			currentFileKeys  : this.allCurrentFileKeys(),
			originalFileKeys : this.allOriginalFileKeys(),
			words:
			{
				codeTranslateWords: this.allCodeTranslateWords(),
				funcTranslateWords: this.allFuncTranslateWords(),
				usedTranslateWords: this.allUsedTranslateWords(),
			},
		};
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
		var result = self.words.codeTranslateWords.list.slice();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allCodeTranslateWords().list);
		});

		return new CodeTranslateWords(result);
	},
	allFuncTranslateWords: function()
	{
		var self = this;
		var result = self.words.funcTranslateWords.list.slice();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allFuncTranslateWords().list);
		});

		return new FuncTranslateWords(result);
	},
	allUsedTranslateWords: function()
	{
		var self = this;
		var arrs = self.subScopeDatas.map(function(item)
		{
			return item.allUsedTranslateWords().data;
		});

		arrs.unshift(true, {});
		arrs.push(self.words.usedTranslateWords.data);

		var result = extend.apply(null, arrs);
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
		var result = self.dirtyWords.list.slice();

		self.subScopeDatas.forEach(function(item)
		{
			ArrayPush.apply(result, item.allDirtyWords());
		});

		return new DirtyWords(list);
	},
});

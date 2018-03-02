var _				= require('lodash');
var debug			= require('debug')('i18nc-core:i18n_placeholder');
var DEF				= require('./def');
var emitter			= require('./emitter').emitter;
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
var i18nTpl			= require('./i18n_func/render');
var i18nParser		= require('./i18n_func/parser');
var i18nGenerator	= require('./i18n_func/generator');


exports.I18NPlaceholder = I18NPlaceholder;

// ast 解析的时候，必须要有range
function I18NPlaceholder(codeTranslateWords, completedCode, options, orignalAst)
{
	this.codeTranslateWords	= codeTranslateWords;
	this.completedCode		= completedCode;
	this.options			= options;
	this.orignalAst			= orignalAst;

	this.renderType			= null;
	this.handlerName		= null;
	this._parseResult		= null;
}

_.extend(I18NPlaceholder.prototype,
{
	toString: function()
	{
		var renderType = this.getRenderType();
		debug('renderType:%s', renderType);

		switch(renderType)
		{
			case 'partial':
				return this._updatePartialCode();

			case 'orignal':
				return this.orignalAst ? this._keepOldCode() : '';

			case 'empty':
				return '';

			case 'simple':
				return this._updateSimpleFunctionCode();

			case 'complete':
			default:
				var newCode = this._updateTotalCode();
				// 如果没有orignalAst，表明是新的code，那么就多添加两个换行吧
				if (!this.orignalAst) newCode = '\n\n'+ newCode +'\n\n';

				return newCode;
		}
	},
	getRenderType: function()
	{
		if (this.renderType) return this.renderType;

		var funcInfo = this.parse();
		if (funcInfo.inited)
		{
			// 判断是否不需要插入新的i18n函数，直接使用原来代码
			var codeTranslateWords = this.codeTranslateWords || {};
			var defaults_length = codeTranslateWords.DEFAULTS
					&& codeTranslateWords.DEFAULTS.length;
			var subtypes_length = codeTranslateWords.SUBTYPES
					&& Object.keys(codeTranslateWords.SUBTYPES).length;

			if (!defaults_length && !subtypes_length)
			{
				debug('ignore generate I18NHandler');
				return 'orignal';
			}
		}
		else
		{
			// 只更新翻译数据
			if (this.options.isPartialUpdate
				&& this.orignalAst
				&& funcInfo.__TRANSLATE_JSON__ast
				&& (!this.handlerName || funcInfo.handlerName == this.handlerName)
				&& funcInfo.__FUNCTION_VERSION__ == DEF.I18NFunctionVersion)
			{
				return 'partial';
			}
		}

		return 'complete';
	},
	parse: function()
	{
		if (!this._parseResult)
		{
			if (this.orignalAst)
			{
				this._parseResult = i18nParser.parse(this.orignalAst, this.options);
				// 处理解析出来的handler
				// this._parseResult.handlerName = this.orignalAst.id && this.orignalAst.id.name;
			}

			if (!this._parseResult || !this._parseResult.__FILE_KEY__)
			{
				this._parseResult =
				{
					inited					: true,
					handlerName				: this.options.I18NHandlerName,
					__FILE_KEY__			: this.options.defaultFileKey,
					__FUNCTION_VERSION__	: DEF.I18NFunctionVersion,
					__TRANSLATE_JSON__		: {},
				};
			}
		}

		return this._parseResult;
	},
	getTranslateJSON: function()
	{
		return i18nGenerator.getTranslateJSON(this._getTranslateJSONArgs());
	},
	_getRenderTranslateJSONCode: function()
	{
		var translateJSON = this.getTranslateJSON();
		if (this.options.isInjectAllTranslateWords)
		{
			i18nGenerator.fillNoUsedCodeTranslateWords(
				translateJSON,
				this.codeTranslateWords,
				this.options.defaultTranslateLanguage
			);
		}
		var translateJSONCode = i18nGenerator.genTranslateJSONCode(translateJSON);

		var emitData =
		{
			options						: this.options,
			translateJSON				: translateJSON,
			originalTranslateJSONCode	: translateJSONCode,
			translateJSONCode			: translateJSONCode,
		};

		emitter.emit('newTranslateJSON', emitData);

		return ''+emitData.translateJSONCode;
	},
	_getTranslateJSONArgs: function()
	{
		var funcInfo = this.parse();

		return {
			FILE_KEY			: funcInfo.__FILE_KEY__,
			pickFileLanguages	: this.options.pickFileLanguages,
			funcTranslateWords	: funcInfo.__TRANSLATE_JSON__,
			dbTranslateWords	: this.options.dbTranslateWords,
			codeTranslateWords	: this.codeTranslateWords
		};
	},
	_updatePartialCode: function()
	{
		var funcInfo = this.parse();
		var newJSONCode = this._getRenderTranslateJSONCode();

		// 压缩这个代码的时候，需要加上()
		// 不然esprima会报错
		newJSONCode = this._beautifyCode('('+newJSONCode+')', funcInfo.__TRANSLATE_JSON__ast).slice(1);

		// 删除添加的)的时候，要考虑到escodegen会多加一个;
		// 所以用一个for循环来删除最后的)
		for(var i = newJSONCode.length; i--;)
		{
			if (newJSONCode[i] == ')')
			{
				newJSONCode = newJSONCode.slice(0, i);
				break;
			}
		}

		var json_ast_range = funcInfo.__TRANSLATE_JSON__ast.range;
		var newCode = this.completedCode.slice(this.orignalAst.range[0], json_ast_range[0])
			+ newJSONCode
			+ this.completedCode.slice(json_ast_range[1], this.orignalAst.range[1]);

		return newCode;
	},
	_updateTotalCode: function()
	{
		var funcInfo = this.parse();
		var TRANSLATE_JSON_CODE = this._getRenderTranslateJSONCode();

		// 添加的代码缩进：多一个tab
		TRANSLATE_JSON_CODE = TRANSLATE_JSON_CODE.split('\n').join('\n\t');
		// 更新整个函数
		var renderData =
		{
			handlerName			: this.handlerName || funcInfo.handlerName || this.options.I18NHandlerName,
			FILE_KEY			: funcInfo.__FILE_KEY__,
			FUNCTION_VERSION	: DEF.I18NFunctionVersion,
			GetGlobalCode		: this.options['I18NhandlerTpl:GetGlobalCode'],
			LanguageVarName		: this.options['I18NhandlerTpl:LanguageVarName'],
			TRANSLATE_JSON_CODE	: TRANSLATE_JSON_CODE,
		};

		debug('i18n fucntion renderdata: %o', renderData);

		var newCode = i18nTpl.render(renderData);
		newCode = this._beautifyCode(newCode, this.orignalAst);

		return newCode;
	},

	_keepOldCode: function()
	{
		var old_range = this.orignalAst.range;
		return this.completedCode.slice(old_range[0], old_range[1]);
	},

	_updateSimpleFunctionCode: function()
	{
		var funcInfo = this.parse();
		var SIMPLE_VERSION = DEF.I18NFunctionVersion+'.'
				+ DEF.I18NFunctionSubVersion.SIMPLE;

		if (funcInfo.__FUNCTION_VERSION__ == SIMPLE_VERSION)
		{
			return this._keepOldCode();
		}

		var newCode = i18nTpl.renderSimple(
			{
				handlerName			: this.handlerName || funcInfo.handlerName || this.options.I18NHandlerName,
				FILE_KEY			: funcInfo.__FILE_KEY__,
				FUNCTION_VERSION	: SIMPLE_VERSION,
			});

		newCode = this._beautifyCode(newCode, this.orignalAst);

		return newCode;
	},

	_beautifyCode: function(code, ast)
	{
		if (this.options.isMinFuncTranslateCode)
		{
			return astUtils.mincode(code);
		}

		// 获取原来代码锁进
		var codeIndent = '';
		if (ast)
		{
			codeIndent = astUtils.codeIndent(ast, this.completedCode);
			debug('codeIndent:%s, len:%d', codeIndent, codeIndent.length);
		}

		return code.split('\n').join('\n'+codeIndent);
	}
});

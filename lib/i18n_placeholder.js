var _						= require('lodash');
var debug					= require('debug')('i18nc:i18n_placeholder');
var astUtils				= require('./ast_utils');
var optionsUtils			= require('./options');
var i18nFunctionGenerator	= require('./i18n_function_generator');
var i18nFunctionParser		= require('./i18n_function_parser');


exports.I18NPlaceholder = I18NPlaceholder;

// ast 解析的时候，必须要有range
function I18NPlaceholder(codeTranslateWords, completedCode, options, oldAst)
{
	this.codeTranslateWords	= codeTranslateWords;
	this.completedCode		= completedCode;
	this.options			= options;
	this.oldAst				= oldAst;

	this.renderType			= null;
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
				if (this.oldAst)
				{
					var old_range = this.oldAst.range;
					return this.completedCode.slice(old_range[0], old_range[1]);
				}

				return '';

			case 'empty':
				return '';

			default:
				var newCode = this._updateTotalCode();
				// 如果没有oldAst，表明是新的code，那么就多添加两个换行吧
				if (!this.oldAst) newCode = '\n\n'+ newCode +'\n\n';

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
				return 'orignal';
			}
		}
		else
		{
			// 只更新翻译数据
			if (this.options.isPartialUpdate
				&& this.oldAst
				&& funcInfo.__TRANSLATE_JSON__ast
				&& funcInfo.__FUNCTION_VERSION__ == optionsUtils.I18NFunctionVersion)
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
			if (this.oldAst)
			{
				this._parseResult = i18nFunctionParser.parse(this.oldAst, this.options);
			}

			if (!this._parseResult || !this._parseResult.__FILE_KEY__)
			{
				this._parseResult =
				{
					inited					: true,
					__FILE_KEY__			: this.options.defaultFilekey,
					__FUNCTION_VERSION__	: optionsUtils.I18NFunctionVersion,
					__TRANSLATE_JSON__		: {},
				};
			}
		}

		return this._parseResult;
	},
	getTranslateJSON: function()
	{
		return i18nFunctionGenerator.getTranslateJSON(this._getTranslateJSONArgs());
	},
	_getRenderTranslateJSONCode: function()
	{
		var translateData = this.getTranslateJSON();
		var code = i18nFunctionGenerator.genTranslateJSONCode(translateData);

		if (this.options.genTranslateJSON)
		{
			var funcInfo = this.parse();
			code = this.options.genTranslateJSON(
					code,
					translateData,
					funcInfo.__TRANSLATE_JSON__ast,
					this.options
				);
		}

		return code;
	},
	_getTranslateJSONArgs: function()
	{
		var funcInfo = this.parse();

		return {
			FILE_KEY			: funcInfo.__FILE_KEY__,
			setFileLanguages	: this.options.setFileLanguages,
			funcTranslateWords	: funcInfo.__TRANSLATE_JSON__,
			dbTranslateWords	: this.options.dbTranslateWords,
			codeTranslateWords	: this.codeTranslateWords
		};
	},
	_updatePartialCode: function()
	{
		var funcInfo = this.parse();
		var TRANSLATE_JSON_CODE = this._getRenderTranslateJSONCode();
		var json_ast_range = funcInfo.__TRANSLATE_JSON__ast.range;

		// 获取原来代码锁进
		var codeIndent = '';
		if (this.oldAst)
		{
			codeIndent = astUtils.codeIndent(funcInfo.__TRANSLATE_JSON__ast, this.completedCode);
			debug('codeIndent:%s', codeIndent);
		}

		// 更新局部
		var fixIndex = this.oldAst.range[0];
		var newCode = this.completedCode.slice(this.oldAst.range[0], json_ast_range[0])
			+ TRANSLATE_JSON_CODE.split('\n').join('\n'+codeIndent+'\t')
			+ this.completedCode.slice(json_ast_range[1], this.oldAst.range[1]);

		debug('partialUpdate:%s', newCode);
		return newCode;
	},
	_updateTotalCode: function()
	{
		var funcInfo = this.parse();
		var TRANSLATE_JSON_CODE = this._getRenderTranslateJSONCode();

		// 添加的代码缩进比var多一个tab
		TRANSLATE_JSON_CODE = TRANSLATE_JSON_CODE.split('\n').join('\n\t\t\t');
		// 更新整个函数
		var renderData =
		{
			handlerName			: this.options.handlerName,
			FILE_KEY			: funcInfo.__FILE_KEY__,
			FUNCTION_VERSION	: funcInfo.__FUNCTION_VERSION__ || optionsUtils.I18NFunctionVersion,
			setFileLanguages	: this.options.setFileLanguages,
			GetGlobalCode		: this.options['I18NhandlerTpl:GetGlobalCode'],
			LanguageVarName		: this.options['I18NhandlerTpl:LanguageVarName'],
			TRANSLATE_JSON		: TRANSLATE_JSON_CODE,
		};

		debug('i18n fucntion renderdata: %o', renderData);

		// 获取原来代码锁进
		var codeIndent = '';
		if (this.oldAst)
		{
			codeIndent = astUtils.codeIndent(this.oldAst, this.completedCode);
			debug('codeIndent:%s', codeIndent);
		}

		var newCode = i18nFunctionGenerator.render(renderData)
				.split('\n').join('\n'+codeIndent);
		debug('totalUpdate:%s', newCode);

		return newCode;
	}
});

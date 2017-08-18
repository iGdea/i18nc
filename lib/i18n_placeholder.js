var _						= require('lodash');
var debug					= require('debug')('i18nc:i18n_placeholder');
var optionsUtils			= require('./options');
var i18nFunctionGenerator	= require('./i18n_function_generator');
var i18nFunctionParser		= require('./i18n_function_parser');


exports.I18NPlaceholder = I18NPlaceholder;

function I18NPlaceholder(codeTranslateWords, options, oldAst, oldCode)
{
	this.codeTranslateWords	= codeTranslateWords;
	this.options			= options;
	this.oldAst				= oldAst;
	this.oldCode			= oldCode;

	this._parseResult		= null;
}

_.extend(I18NPlaceholder.prototype,
{
	toString: function()
	{
		var TRANSLATE_JSON = i18nFunctionGenerator.genTranslateJSONCode(this._getTranslateJSONArgs());
		var funcInfo = this.parse();

		if (this.options.genTranslateJson)
		{
			TRANSLATE_JSON = this.options.genTranslateJson(
					TRANSLATE_JSON,
					funcInfo.__TRANSLATE_JSON__ast,
					this.options
				);
		}

		if (!funcInfo.inited
			&& this.options.isPartialUpdate
			&& this.oldAst
			&& funcInfo.__TRANSLATE_JSON__ast
			&& funcInfo.__FUNCTION_VERSION__ == optionsUtils.I18NFunctionVersion)
		{
			// 更新局部
			var fixIndex = this.oldAst.range[0];
			var json_ast_range = funcInfo.__TRANSLATE_JSON__ast.range;
			var newCode = this.oldCode.slice(0, json_ast_range[0]-fixIndex)
				+ TRANSLATE_JSON
				+ this.oldCode.slice(json_ast_range[1]-fixIndex);

			debug('partialUpdate:%s', newCode);
			return newCode;
		}


		// 更新整个函数
		var renderData =
		{
			handlerName			: this.options.handlerName,
			FILE_KEY			: funcInfo.__FILE_KEY__,
			FUNCTION_VERSION	: funcInfo.__FUNCTION_VERSION__ || optionsUtils.I18NFunctionVersion,
			acceptLanguageCode	: this.options.acceptLanguageCode,
			TRANSLATE_JSON		: TRANSLATE_JSON,
		};

		debug('i18n fucntion renderdata: %o', renderData);

		return i18nFunctionGenerator.render(renderData);
	},
	parse: function()
	{
		if (!this._parseResult)
		{
			if (this.oldAst)
			{
				this._parseResult = i18nFunctionParser.parse(this.oldAst);
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
	_getTranslateJSONArgs: function()
	{
		var funcInfo = this.parse();

		return {
			FILE_KEY			: funcInfo.__FILE_KEY__,
			funcTranslateWords	: funcInfo.__TRANSLATE_JSON__,
			dbTranslateWords	: this.options.dbTranslateWords,
			codeTranslateWords	: this.codeTranslateWords
		};
	}
});

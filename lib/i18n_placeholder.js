var _						= require('lodash');
var debug					= require('debug')('i18nc:i18n_placeholder');
var optionsUtils			= require('./options');
var i18nFunctionGenerator	= require('./i18n_function_generator');
var i18nFunctionParser		= require('./i18n_function_parser');


exports.I18NPlaceholder = I18NPlaceholder;

function I18NPlaceholder(codeTranslateWords, code, options, oldAst)
{
	this.codeTranslateWords	= codeTranslateWords;
	this.code				= code;
	this.options			= options;
	this.oldAst				= oldAst;

	this._parseResult		= null;
}

_.extend(I18NPlaceholder.prototype,
{
	toString: function()
	{
		var TRANSLATE_JSON = i18nFunctionGenerator.genTranslateJSONCode(this._getTranslateJSONArgs());
		var funcInfo = this.parse();

		if (this.options.genTranslateJSON)
		{
			TRANSLATE_JSON = this.options.genTranslateJSON(
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
			var json_ast_range = funcInfo.__TRANSLATE_JSON__ast.range;

			// 获取原来代码锁进
			var codeIndent = '';
			if (this.oldAst)
			{
				codeIndent = this.code.slice(0, json_ast_range[0]).split('\n').pop();
				codeIndent = codeIndent.match(/^\s*/)[0];
				if (!codeIndent) codeIndent = '';

				debug('codeIndent:%s', codeIndent);
			}

			// 更新局部
			var fixIndex = this.oldAst.range[0];
			var newCode = this.code.slice(this.oldAst.range[0], json_ast_range[0])
				+ TRANSLATE_JSON.split('\n').join('\n'+codeIndent+'\t')
				+ this.code.slice(json_ast_range[1], this.oldAst.range[1]);

			debug('partialUpdate:%s', newCode);
			return newCode;
		}

		// 添加的代码缩进比var多一个tab
		TRANSLATE_JSON = TRANSLATE_JSON.split('\n').join('\n\t\t\t');
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

		// 获取原来代码锁进
		var codeIndent = '';
		if (this.oldAst)
		{
			codeIndent = this.code.slice(0, this.oldAst.range[0]).split('\n').pop();
			codeIndent = codeIndent.match(/^\s*/)[0];
			if (!codeIndent) codeIndent = '';

			debug('codeIndent:%s', codeIndent);
		}

		var newCode = i18nFunctionGenerator.render(renderData)
				.split('\n').join('\n'+codeIndent);
		debug('totalUpdate:%s', newCode);

		// 如果没有oldAst，表明是新的code，那么就多添加两个换行吧
		if (!this.oldAst) newCode = '\n\n'+ newCode +'\n\n';

		return newCode;
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

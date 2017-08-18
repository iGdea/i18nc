var _ = require('lodash');

exports.defaults =
{
	cutWordReg				: /[^<>]*[^\u0020-\u007e]+[^<>]*/g,
	handlerName				: 'I18N',
	defaultFilekey			: 'default_file_key',

	// 数据库的数据
	// @see test/exmaple/translate_words_db.json
	dbTranslateWords		: null,

	// 优先插入到define函数中
	isInsertToDefineHalder	: true,

	// 优先进行局部更新
	isPartialUpdate			: true,

	// js代码中，获取当前语言包的代码
	acceptLanguageCode		: 'typeof window == "object" ? window.__i18n_lan__ : typeof global == "object" && global.__i18n_lan__',

	loadTranslateJsonByAst: function(ast, options)
	{
		return ast;
	},
	genTranslateJson: function(code, oldJsonAst, options)
	{
		return code;
	}
}

exports.extend = function(obj)
{
	return _.extend({}, exports.defaults, obj);
}


exports.escodegenOptions =
{
	// comment: true,
	format:
	{
		escapeless: true,
		indent:
		{
			style: '\t'
		}
	}
};


exports.I18NFunctionVersion = 1;


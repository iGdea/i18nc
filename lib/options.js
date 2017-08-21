var _ = require('lodash');

exports.defaults =
{
	cutWordReg					: /[^<>]*[^\u0020-\u007e]+[^<>]*/g,
	handlerName					: 'I18N',
	defaultFilekey				: 'default_file_key',
	
	// 数据库的数据
	// @see test/exmaple/translate_words_db.json
	dbTranslateWords			: null,
	
	// 优先插入到define函数中
	isInsertToDefineHalder		: true,
	
	// 如果不是插入到define函数中
	// 插入到文件头部的情况
	// 对文件内容进行强制闭包处理
	isClosureWhenInsertedHead	: true,
	
	// 优先进行局部更新
	isPartialUpdate				: true,
	
	
	// js代码中，获取当前语言包的代码
	acceptLanguageCode			: 'typeof window == "object" ? window.__i18n_lan__ : typeof global == "object" && global.__i18n_lan__',

	loadTranslateJSONByAst: function(ast, options)
	{
		return ast;
	},
	genTranslateJSON: function(code, oldJSONAst, options)
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

exports.esprimaOptions =
{
	range: true,
	loc: true
};

exports.I18NFunctionVersion = 1;


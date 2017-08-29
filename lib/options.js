var _ = require('lodash');

exports.defaults =
{
	cutWordReg					: /[^<>]*[^\u0020-\u007e\b\s]+[^<>]*/g,
	handlerName					: 'I18N',
	defaultFilekey				: 'default_file_key',

	// 忽略扫描到object key带有替换字符时的错误
	isIgnoreScanWarn			: false,

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

	// 单单只打包这个语言包到文件
	useOnlyLanguages			: null,


	// js代码中，获取当前语言包的代码
	'I18NhandlerCode:getGlobalCode': 'typeof window == "object" ? window : typeof global == "object" && global',

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


exports.BLOCK_MODIFIER =
{
	SKIP_SACN		: '[i18nc]skip_scan',
	SKIP_REPLACE	: '[i18nc]skip_repalce',
};

exports.AST_FLAGS =
{
	SKIP_SACN		: 1 << 0,
	SKIP_REPLACE	: 1 << 1,
	SELF_CREATED	: 1 << 2,
	DIS_REPLACE		: 1 << 3,
};

exports.I18NFunctionVersion = 2;

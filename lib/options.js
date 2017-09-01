var _ = require('lodash');

exports.defaults =
{
	// 分词的正则
	cutWordReg					: /[^<>]*[^\u0020-\u007e\b]+[^<>]*/g,

	// 代码中，调用和生成的函数名
	handlerName					: 'I18N',

	// 默认的filekey，一般用文件的相对路径
	// 可以针对filekey，打包特别的翻译
	defaultFilekey				: 'default_file_key',

	// 忽略扫描到object key带有替换字符时的错误
	isIgnoreScanWarn			: false,

	// 这些函数里面的调用，或则声明不进行扫描
	// 帮助对一个文档进行多次替换
	ignoreScanFunctionNames		: [],

	// 导入翻译数据
	// @see test/exmaple/translate_words_db.json
	dbTranslateWords			: null,

	// 如果需要插入I18N函数，优先插入到define函数中
	isInsertToDefineHalder		: true,

	// 如果不是插入到define函数中
	// 插入到文件头部的情况
	// 对文件内容进行强制闭包处理
	isClosureWhenInsertedHead	: true,

	// 对I18N函数优先进行局部更新（只更新翻译数据）
	isPartialUpdate				: true,

	// 单单只打包这个语言包到文件
	setFileLanguages			: null,


	// js代码中，获取当前语言包的代码
	'I18NhandlerTpl:GetGlobalCode': 'typeof window == "object" ? window : typeof global == "object" && global',
	'I18NhandlerTpl:LanguageVarName': '__i18n_lan__',

	loadTranslateJSONByAst: function(ast, options)
	{
		return ast;
	},
	genTranslateJSON: function(code, translateData, translateDataAst, options)
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
	SKIP_SACN		: '[i18nc] skip_scan',
	SKIP_REPLACE	: '[i18nc] skip_repalce',
};

exports.AST_FLAGS =
{
	SKIP_SACN		: 1 << 0,
	SKIP_REPLACE	: 1 << 1,
	SELF_CREATED	: 1 << 2,
	DIS_REPLACE		: 1 << 3,
};

exports.I18NFunctionVersion = 2;

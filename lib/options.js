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

	// 在源代码中，输出所有提取的关键字
	// 没有翻译结果的关键字，以注释的形式插入
	isPackageAllTranslateWords	: true,
	// 当没有找到任何语言包 & 启动了isPackageAllTranslateWords
	// 使用这个语言，作为代码中的语言包
	// 由于没有任何实际数据，对代码结果无影响
	defaultTranslateLanguage	: '<LAN KEY>',

	// 在采集的时候，针对+号操作，是否合并文本
	// NONE      不合并
	// LITERAL   只合并简单文本
	// I18N      只合并不带subtype的I18N
	// ALL_I18N  忽视subtype进行合并
	// 注意：只要带有subtype，合并之后，都会去掉subtype
	comboLiteralMode			: 'NONE',

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
	setFileLanguages			: [],

	// 对插入的I18N进行代码压缩
	// 设置true，会导致isPackageAllTranslateWords失效
	isMinI18Nhanlder			: false,


	// js代码中，获取当前语言包的代码
	'I18NhandlerTpl:GetGlobalCode': 'typeof window == "object" ? window : typeof global == "object" && global',
	'I18NhandlerTpl:LanguageVarName': '__i18n_lan__',

	// loadTranslateJSON: function(){},
	// newTranslateJSON: function(){},
	// cutword: function(){},
}

exports.extend = function(obj)
{
	var obj = _.extend({}, exports.defaults, obj);

	// 直接设置为false
	// 避免生成无用的key
	if (obj.isMinI18Nhanlder)
	{
		obj.isPackageAllTranslateWords = false;
	}

	return obj;
}


exports.escodegenOptions =
{
	comment: true,
	format:
	{
		escapeless: true,
		newline: '\n',
		indent:
		{
			style: '\t'
		}
	}
};


exports.escodegenMinOptions =
{
	comment: false,
	format:
	{
		escapeless: true,
		newline: '\n',
		quotes: 'auto',
		compact: true,
		indent:
		{
			style: ''
		}
	}
}


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
	SKIP_SACN				: 1 << 0,
	SKIP_REPLACE			: 1 << 1,
	SELF_CREATED			: 1 << 2,
	DIS_REPLACE				: 1 << 3,
	FROM_SPLICED_LITERAL	: 1 << 4,
	VALID_I18N				: 1 << 5,
};

exports.I18NFunctionVersion = "3";
exports.I18NFunctionSubVersion =
{
	SIMPLE: 's'
}

var _ = require('lodash');
var debug = require('debug')('i18nc-core:options');

exports.defaults =
{
	// 分词的正则
	// 排除 "' 是因为tag标签属性用这个分隔，而本身很少用这两个引号
	// 排除 \s 防止全部空格换行情况
	cutWordReg					: /[^<>"'\n]*[^\u0020-\u007e\b\s]+[^<>"'\n]*/g,

	// 优化分词结果
	// RemoveTplComment		处理tpl转过来的js内容的时候，先删除tpl注释再处理
	// KeyTrim				移除翻译内容的前后空格
	// SplitByEndSymbol		根据结束分隔符号，进行再度分词，例如. ? ; 等
	cutWordBeautify				: ['RemoveTplComment', 'KeyTrim', 'SplitByEndSymbol'],
	'cutWordBeautify:endSymbol'	: '.!?;。！？；',

	// 代码中，调用和生成的函数名
	I18NHandlerName				: 'I18N',
	// I18NHandlerName的别名
	// 一般都是由于修改I18NHandlerName导致的历史数据遗留
	// 注意：I18NHandlerAlias优先级比ignoreScanHandlerNames低
	I18NHandlerAlias			: [],

	// 默认的filekey，一般用文件的相对路径
	// 可以针对filekey，打包特别的翻译
	defaultFileKey				: '*',

	// 忽略扫描的错误
	// ObjectKey		object key带有替换字符时的错误，不支持替换
	ignoreScanError				: [],

	// 在源代码中，输出所有提取的关键字
	// 没有翻译结果的关键字，以注释的形式插入
	isInjectAllTranslateWords	: true,
	// 当没有找到任何语言包 & 启动了isInjectAllTranslateWords
	// 使用这个语言，作为代码中的语言包
	// 由于没有任何实际数据，对代码结果无影响
	defaultTranslateLanguage	: 'en-US',

	// 修改code范围
	// 如果删除，则这些特性在输出的code里面不会被修改
	// 注意：
	// 新i18n函数的注入和作用区间的处理，不受这个的影响
	// 如果介意i18n函数的处理，可以不处理后面输出的code，或则手动添加i18n函数
	//
	// 可以配置的项：
	// I18NHandler        修改已经插入到代码中的I18N函数体
	// TranslateWord      将分词的结果，用I18N函数包裹起来
	// I18NHandlerAlias   将alias统一成handlerName
	//
	// 如果去掉translateWord，
	// 配合最后输出的I18NArgsTranslateWords和codeTranslateWords，
	// 可以实现check效果
	codeModifiedArea			: ['I18NHandler', 'TranslateWord', 'I18NHandlerAlias'],

	// 在采集的时候，针对+号操作，是否合并文本
	// NONE      不合并
	// LITERAL   只合并简单文本
	// I18N      只合并不带subtype/tpldata的I18N
	// ALL_I18N  忽视subtype/tpldata进行合并
	// 注意：只要带有subtype/tpldata，合并之后，都会去掉subtype
	comboLiteralMode			: 'NONE',

	// 这些函数里面的调用，或则声明不进行扫描
	// 帮助对一个文档进行多次替换
	ignoreScanHandlerNames		: [],

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
	pickFileLanguages			: [],

	// 对插入的I18N进行代码压缩
	// 设置true，会导致isInjectAllTranslateWords失效
	isMinFuncTranslateCode		: false,


	// js代码中，获取当前语言包的代码
	'I18NhandlerTpl:GetGlobalCode': 'typeof window == "object" ? window : typeof global == "object" && global',
	'I18NhandlerTpl:LanguageVarName': '__i18n_lan__',

	loadTranslateJSON			: null,
	newTranslateJSON			: null,
	cutword						: null,
};


var optionFalseKeys = {};
_.each(exports.defaults, function(val, key)
{
	if (!val || typeof val == 'boolean') optionFalseKeys[key] = true;
});
exports.extend = function(obj)
{
	if (!obj) return _.extend({}, exports.defaults);
	var ret = {};

	_.each(exports.defaults, function(val, key)
	{
		if (obj.hasOwnProperty(key))
		{
			var val2 = obj[key];
			if (val2 || optionFalseKeys[key])
			{
				ret[key] = val2;
			}
			else
			{
				ret[key] = val;
				debug('option val == false, key:%s, val:%o', key, val2);
			}
		}
		else
		{
			ret[key] = val;
		}
	});

	// 直接设置为false
	// 避免生成无用的key
	if (ret.isMinFuncTranslateCode) ret.isInjectAllTranslateWords = false;

	// for emitter
	// 回调的时候，可能会带有额外的参数，保留这份
	ret.originalOptions = obj;

	return ret;
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

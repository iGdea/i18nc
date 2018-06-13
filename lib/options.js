/* global window */

'use strict';

var _ = require('lodash');
var debug = require('debug')('i18nc-core:options');


exports.defaults =
{
	// 分词的正则
	// 前后两个匹配，是为了尽可能匹配多的字符
	// 排除所有的ascii字符，https://zh.wikipedia.org/wiki/ASCII
	// 排除 "' 是因为tag标签属性用这个分隔，而本身很少用这两个引号
	// 排除 <> 是因为html标签
	cutWordReg: /[^\u0000-\u001F\u007F"'<>]*[^\u0000-\u007F]+[^\u0000-\u001F\u007F"'<>]*/g,

	// 代码中，调用和生成的函数名
	I18NHandlerName: 'I18N',
	// I18NHandlerName的别名
	// 一般都是由于修改I18NHandlerName导致的历史数据遗留
	// 注意：I18NHandlerAlias优先级比ignoreScanHandlerNames低
	I18NHandlerAlias: [],

	// 默认的filekey，一般用文件的相对路径
	// 可以针对filekey，打包特别的翻译
	defaultFileKey: '*',

	// 在源代码中，输出所有提取的关键字
	// 没有翻译结果的关键字，以注释的形式插入
	isInjectAllTranslateWords: true,
	// 当没有找到任何语言包 & 启动了isInjectAllTranslateWords
	// 使用这个语言，作为代码中的语言包
	// 由于没有任何实际数据，对代码结果无影响
	defaultTranslateLanguage: 'en-US',

	// 修改code范围
	// 如果删除，则这些特性在输出的code里面不会被修改
	// 注意：
	// 新i18n函数的注入和作用区间的处理，不受这个的影响
	// 如果介意i18n函数的处理，可以不处理后面输出的code，或则手动添加i18n函数
	//
	// 如果去掉TranslateWord，
	// 配合最后输出的I18NArgsTranslateWords和codeTranslateWords，
	// 可以实现check效果
	codeModifiedArea:
	{
		// 修改及插入已经插入到代码中的I18N函数体
		// 如果不插入i18n函数定义
		// 那么下面的isClosureWhenInsertedHead 均无效
		I18NHandler: true,
		// 将分词的结果，用I18N函数包裹起来
		TranslateWord: true,
		// TranslateWord中的RegExp类型
		TranslateWord_RegExp: true,
		// 将alias统一成handlerName
		I18NHandlerAlias: true
	},

	// 这些函数里面的调用，或则声明（如果有）不进行扫描
	// 注意：如果带有. 则进行函数调用拆分
	ignoreScanHandlerNames:
	[
		'console.log',
		'console.warn',
		'console.trace',
		'console.info',
		'console.error',
		'console.dir',
		'console.table'
	],

	// 导入翻译数据
	// @see test/exmaple/translate_words_db.json
	dbTranslateWords: null,
	// 翻译的时候，不参考这这里面的数据（dbTranslateWords没有数据的时候，直接删除翻译）
	isIgnoreI18NHandlerTranslateWords: false,

	// 如果需要插入I18N函数，优先插入到define函数中
	isInsertToDefineHalder: true,

	// 如果不是插入到define函数中
	// 插入到文件头部的情况
	// 对文件内容进行强制闭包处理
	isClosureWhenInsertedHead: true,

	// 对I18N函数优先进行局部更新（只更新翻译数据）
	isPartialUpdate: true,

	// 单单只打包这个语言包到文件
	pickFileLanguages: [],

	// 对插入的I18N进行代码压缩
	// 设置true，会导致isInjectAllTranslateWords失效
	isMinFuncTranslateCode: false,


	// js代码中，获取当前语言包的代码
	// 可以是function 也可以是string，如果是string，那么及是全局的函数调用
	I18NhandlerTpl_GetLanguageCode: GetLanguageCodeHandler,
	// 新插入的I18N函数包裹内容
	I18NhandlerTpl_NewHeaderCode: '\n\n/* eslint-disable */\n',
	I18NhandlerTpl_NewFooterCode: '\n/* eslint-enable */\n\n',

	// events
	loadTranslateJSON: null,
	newTranslateJSON: null,
	cutword: null,
};


exports.extend = function(options)
{
	if (!options) return _.extend({}, exports.defaults);
	var result = {};

	_.each(exports.defaults, function(defaultVal, key)
	{
		if (options.hasOwnProperty(key))
		{
			var newVal = options[key];
			if (newVal || typeof defaultVal == 'boolean')
			{
				if (key == 'codeModifiedArea')
				{
					// 进行arr转obj的特殊处理
					if (_.isArray(newVal))
					{
						var tmp = {};
						newVal.forEach(function(subkey)
						{
							tmp[subkey] = true;
						});
						result[key] = tmp;
					}
					else if (typeof newVal == 'object')
					{
						result[key] = _.extend({}, defaultVal, newVal);
					}
					else
					{
						debug('not array or object for key:%s, optionsVal:%s', key, newVal);
					}
				}
				else
				{
					result[key] = newVal;
				}
			}
			else if (key == 'cutWordReg')
			{
				debug('cutWordReg is empty: %s', newVal);
				result[key] = newVal;
			}
			else
			{
				result[key] = defaultVal;
				debug('use default val, key:%s, optionsVal:%s', key, newVal);
			}
		}
		else
		{
			result[key] = defaultVal;
		}
	});

	if (!result.codeModifiedArea.I18NHandler)
	{
		result.isClosureWhenInsertedHead = false;
	}

	// 直接设置为false
	// 避免生成无用的key
	if (result.isMinFuncTranslateCode)
	{
		result.isInjectAllTranslateWords = false;
	}

	// for emitter
	// 回调的时候，可能会带有额外的参数，保留这份
	result.originalOptions = options;

	return result;
}


function GetLanguageCodeHandler(cache)
{
	if (!cache.global)
	{
		cache.global = (typeof window == 'object' && window)
			|| (typeof global == 'object' && global)
			|| {};
	}

	return cache.global.__i18n_lan__;
}

// fix istanbul for test
if (process.env.running_under_istanbul)
{
	var GetLanguageCodeFuncCode = GetLanguageCodeHandler.toString();
	GetLanguageCodeFuncCode = GetLanguageCodeFuncCode
		.replace(/__cov_(.+?)\+\+[,;]?/g, '')
		.replace(/else\{\}/, '');
	GetLanguageCodeHandler.toString = function()
	{
		return GetLanguageCodeFuncCode;
	};
}


exports.escodegenOptions =
{
	comment: true,
	format:
	{
		// escapeless 为true的时候，会把 \u0000 这样的字符直接以字符的形式输出
		// 不开启，又会导致一些普通字符转移输出，比如“，”
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

'use strict';

var _ = require('lodash');
var extend = require('extend');
var debug = require('debug')('i18nc-core:options');
var depdOptions = require('./upgrade/depd_options');
var getLanguageCodeHandler = require('./upgrade/tpl/getlanguagecode_handler');
var ObjectToString = ({}).toString;

exports.defaults =
{
	// 分词的正则
	// 前后两个匹配，是为了尽可能匹配多的字符
	// 排除所有的ascii字符，https://zh.wikipedia.org/wiki/ASCII
	// 排除 "' 是因为tag标签属性用这个分隔，而本身很少用这两个引号
	// 排除 <> 是因为html标签
	cutwordReg: /[^\u0000-\u001F\u007F"'<>]*[^\u0000-\u007F]+[^\u0000-\u001F\u007F"'<>]*/g,

	// 代码中，调用和生成的函数名
	I18NHandlerName: 'I18N',
	// I18NHandlerName的别名
	// 一般都是由于修改I18NHandlerName导致的历史数据遗留
	// 注意：I18NHandlerAlias优先级比ignoreScanHandlerNames低
	I18NHandlerAlias: [],

	// 导入翻译数据
	// @see test/exmaple/translate_words_db.json
	dbTranslateWords: null,

	I18NHandler:
	{
		data:
		{
			// 默认的filekey，一般用文件的相对路径
			// 可以针对filekey，打包特别的翻译
			defaultFileKey: '*',
			// 当没有找到任何语言包 & 启动了 I18NHandler.style.comment4nowords
			// 使用这个语言，作为代码中的语言包
			// 由于没有任何实际数据，对代码结果无影响
			defaultLanguage: 'en-US',
			// 单单只打包这个语言包到文件
			onlyTheseLanguages: [],
			// 翻译的时候，不参考I18N里面的数据（dbTranslateWords没有数据的时候，直接删除翻译）
			ignoreFuncWords: false,
		},
		upgrade:
		{
			// 函数是否能更新的总开关
			// 修改及插入已经插入到代码中的I18N函数体
			// 如果false 那么下面的 I18NHandler.insert.checkClosure 均无效
			enable: true,
			// 对I18N函数优先进行局部更新（只更新翻译数据）
			partial: true,
			// 函数版本号不同的时候，更新函数体
			checkVersion: true,
			// 更新翻译数据
			// 在只更新函数的时候，方便做文件版本库校验
			// 注意：此配置只影响输出代码的结果，不会影响输出的JSON结果
			updateJSON: true,
		},
		style:
		{
			// 对插入的I18N进行代码压缩
			minFuncCode: false,
			// 设置true，会导致 I18NHandler.style.comment4nowords 失效
			minFuncJSON: false,
			// 在源代码中，输出所有提取的关键字
			// 没有翻译结果的关键字，以注释的形式插入
			comment4nowords: true,

			proxyGlobalHandler:
			{
				// 在I18N函数体内，调用此函数，代替插入过多代码
				// 即使不使用此参数，也可以使用如下特定的写法，告诉工具，生成globalfunc 代替 fullfunc
				// function I18N(msg){return ''+topI18NHandler(msg, arguments);}
				// 注意：此配置只会影响没有进行插装，如果要全部更新，需要配置 upgrade.partial false
				// 注意：更新函数版本号，不会触发此更新
				enable: false,
				name: 'topI18N',
				// 忽略源代码中解析出来的原来的I18NHandler.style.proxyGlobalHandler.name，强制使用配置文件的值
				// 如果原来有值，但不同，会触发更新；原来没有，则不会进行更新
				ignoreFuncCode: false,
			},
		},
		insert:
		{
			// 是否插入新的I18NHandler函数
			// enable: true,
			// 插入I18N函数前，检查所在位置，是否闭包
			checkClosure: true,
			// 如果需要插入I18N函数，优先插入到define函数中
			priorityDefineHalder: true,
		},
		tpl:
		{
			// js代码中，获取当前语言包的代码
			// 可以是function 也可以是string，
			// 		string，即全局的函数调用
			// 		function，必须是可被序列化成字符串，能独立运行
			getLanguageCode: getLanguageCodeHandler,
			// 对GetLanguageCode中的变量$LanguageVars.name$进行替换
			languageVars:
			{
				// 通用name
				name: '__i18n_lan__',
				// cookie 字段特殊化
				cookie: 'proj.i18n_lan',
			},
			// 新插入的I18N函数包裹内容
			newHeaderCode: '\n\n/* eslint-disable */\n',
			newFooterCode: '\n/* eslint-enable */\n\n',
		},
	},

	// 修改code范围
	// 如果删除，则这些特性在输出的code里面不会被修改
	// 注意：
	// 新i18n函数的注入和作用区间的处理，不受这个的影响
	// 如果介意i18n函数的处理，可以不处理后面输出的code，或则手动添加i18n函数
	//
	// 如果去掉TranslateWord，
	// 配合最后输出的I18NArgsTranslateWords和codeTranslateWords，
	// 可以实现check效果
	codeModifiedArea: new FeatureEnableOnly(
	{
		// I18NHandler 已经改名为 I18NHandler.upgrade.enable
		// I18NHandler: true,
		// 将分词的结果，用I18N函数包裹起来
		TranslateWord: true,
		// TranslateWord中的RegExp类型
		TranslateWord_RegExp: false,
		// 将alias统一成handlerName
		I18NHandlerAlias: true
	}),

	// 这些函数里面的调用，或则声明（如果有）不进行扫描
	// 注意：如果带有. 则进行函数调用拆分
	ignoreScanHandlerNames: new FeatureEnableMore(
	{
		'console.log'	: true,
		'console.warn'	: true,
		'console.trace'	: true,
		'console.info'	: true,
		'console.error'	: true,
		'console.dir'	: true,
		'console.table'	: true,
	}),

	// 插件配置注入
	pluginEnabled: new FeatureEnableOnly({}),
	pluginSettings: {},

	events:
	{
		loadTranslateJSON: null,
		newTranslateJSON: null,
		beforeScan: null,
		cutword: null,
		assignLineStrings: null,
	},
};


if (Object.freeze)
{
	_.each(exports.defaults, function(val, key)
	{
		if (key != 'pluginEnabled' && key != 'pluginSettings')
		{
			deepFreeze(val);
		}
	});

	Object.freeze(exports.defaults);
}


exports.extend = function(options)
{
	if (!options) return _.extend({}, exports.defaults);

	depdOptions(options);

	var result = _extendDefault(exports.defaults, options);

	// if (!result.codeModifiedArea.I18NHandler)
	// {
	// 	if (result.I18NHandler.insert === exports.defaults.I18NHandler.insert)
	// 	{
	// 		result = extend(true, {}, result);
	// 	}
	// 	result.I18NHandler.insert.checkClosure = false;
	// }

	// 直接设置为false
	// 避免生成无用的key
	if (result.I18NHandler.style.minFuncJSON)
	{
		if (result.I18NHandler.style === exports.defaults.I18NHandler.style)
		{
			result = extend(true, {}, result);
		}
		result.I18NHandler.style.comment4nowords = false;
	}

	// for emitter
	// 回调的时候，可能会带有额外的参数，保留这份
	result.originalOptions = options;

	var cutwordReg = result.cutwordReg;
	// 必须lastIndex必须重制为0，且处于global状态
	if (cutwordReg instanceof RegExp
		&& (cutwordReg.lastIndex !== 0 || !cutwordReg.global))
	{
		throw new Error('Invalid cutwordReg');
	}

	return result;
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






function deepFreeze(obj)
{
	if (!obj) return;

	if (checkFreeze(obj))
	{
		_.each(obj, function(val)
		{
			if (checkFreeze(val)) Object.freeze(val);
		});
		Object.freeze(obj);
	}
}

function checkFreeze(val)
{
	var type = ObjectToString.call(val);
	return type == '[object Object]' || type == '[object Array]';
}


function FeatureEnableOnly(settings)
{
	_.extend(this, settings);
}

FeatureEnableOnly.prototype._arr2json = function(arr)
{
	var self = this;
	var result = {};
	arr.forEach(function(name)
	{
		if (typeof self[name] == 'boolean')
			result[name] = true;
		else
			debug('ignore key <%s>, which are not defined in defaults.', name);
	});
	return result;
}

function FeatureEnableMore(settings)
{
	_.extend(this, settings);
}

FeatureEnableMore.prototype._arr2json = function(arr)
{
	var result = {};
	arr.forEach(function(name)
	{
		result[name] = true;
	});
	return result;
}


function _extendDefault(defaults, object)
{
	if (!object) return _.extend({}, defaults);

	var result = {};
	_.each(defaults, function(defaultVal, key)
	{
		if (object.hasOwnProperty(key))
		{
			var newVal = object[key];
			var defaultType = typeof defaultVal;

			switch(defaultType)
			{
				case 'object':
					// 如果默认值为null或者undefined，那么运行newVal为任意值
					if (!defaultVal)
					{
						result[key] = newVal;
					}
					else if (defaultVal instanceof RegExp)
					{
						if (newVal === null)
						{
							debug('clear regexp options');
							result[key] = null;
						}
						else if (newVal instanceof RegExp)
						{
							result[key] = newVal;
						}
						else
						{
							debug('ignore regexp val, key:%s, val:%o', key, newVal);
						}
					}
					else if (Array.isArray(newVal))
					{
						if (defaultVal._arr2json)
						{
							result[key] = defaultVal._arr2json(newVal);
						}
						else if (Array.isArray(defaultVal))
						{
							result[key] = newVal;
						}
						else
						{
							debug('ignore array data:%s', key);
							result[key] = defaultVal;
						}
					}
					else
					{
						result[key] = _extendDefault(defaultVal, newVal);
					}
					break;

				case 'boolean':
					result[key] = newVal;
					break;

				default:
					if (newVal)
					{
						result[key] = newVal;
					}
					else
					{
						result[key] = defaultVal;
						debug('ignore options val, key:%s', key);
					}
			}
		}
		else
		{
			result[key] = defaultVal;
		}
	});

	return result;
}

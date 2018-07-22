'use strict';

var getLanguageCodeHandler = require('./upgrade/tpl/getlanguagecode_handler');
var utils = require('./utils/options_utils');


exports.defaults =
{
	/**
	 * 分词的正则
	 *
	 * 前后两个匹配，是为了尽可能匹配多的字符
 	 * 排除所有的ascii字符，https://zh.wikipedia.org/wiki/ASCII
 	 * 排除 "' 是因为tag标签属性用这个分隔，而本身很少用这两个引号
 	 * 排除 <> 是因为html标签
 	 *
	 * @type {RegExp|null}
	 * @default 排除所有的ascii字符的正则
	 */
	cutwordReg: /[^\u0000-\u001F\u007F"'<>]*[^\u0000-\u007F]+[^\u0000-\u001F\u007F"'<>]*/g,

	/**
	 * 插入和运行时包裹的函数名
	 *
	 * @type {String}
	 */
	I18NHandlerName: 'I18N',

	/**
	 * I18NHandlerName的别名
	 * 一般都是由于修改I18NHandlerName导致的历史数据遗留
	 *
	 * @remark I18NHandlerAlias优先级比ignoreScanHandlerNames低
	 * @type {Array}
	 * @default []
	 */
	I18NHandlerAlias: [],

	/**
	 * 这些函数里面的调用，或则声明不进行扫描
	 *
	 * @remark 如果带有. 则进行函数调用拆分
	 * @type {Object|Array}
	 * @default [console.xxxx]
	 */
	ignoreScanHandlerNames: new utils.FeatureEnableMore(
	{
		'console.log'	: true,
		'console.warn'	: true,
		'console.trace'	: true,
		'console.info'	: true,
		'console.error'	: true,
		'console.dir'	: true,
		'console.table'	: true,
	}),

	/**
	 * 导入的翻译数据
	 *
	 * @type {Object}
	 */
	dbTranslateWords: null,

	/**
	 * 注入到代码中的I18N函数的一些配置
	 *
	 * @type {Object}
	 */
	I18NHandler:
	{
		data:
		{
			/**
			 * 翻译代码默认标识key
			 * 一般用文件的相对路径
			 *
			 * @remark 可以针对filekey，打包定制翻译结果
			 * @type {String}
			 */
			defaultFileKey: '*',
			/**
			 * 当没有找到任何语言包 & 启动了 I18NHandler.style.comment4nowords, 使用这个语言，作为代码中的语言包
			 * 由于没有任何实际数据，对代码结果无影响
			 *
			 * @type {String}
			 */
			defaultLanguage: 'en-US',
			/**
			 * 只打包这个列表内语言包到代码中
			 *
			 * @remark 数组为空则不受限制
			 * @type {Array}
			 */
			onlyTheseLanguages: [],
			/**
			 * 翻译的时候，不参考代码中I18N里面的数据
			 *
			 * @remark 启动后，如果dbTranslateWords没有数据，直接删除翻译
			 * @type {Boolean}
			 */
			ignoreFuncWords: false,
		},
		upgrade:
		{
			/**
			 * 能否更新已插入代码中I18N函数体的总开关
			 *
			 * @type {Boolean}
			 */
			enable: true,
			/**
			 * 对I18N函数优先进行局部更新（只更新翻译数据）
			 *
			 * @type {Boolean}
			 */
			partial: true,
			/**
			 * 函数版本号不同的时候，是否更新函数体
			 *
			 * @type {Boolean}
			 */
			checkVersion: true,
			/**
			 * 是否更新代码中的翻译结果JSON
			 * 在只更新函数的时候，方便做文件版本库校验
			 *
 			 * @remark 此配置只影响输出代码的结果，不会影响输出的JSON结果
			 * @type {Boolean}
			 */
			updateJSON: true,
		},
		style:
		{
			/**
			 * 对插入的I18N进行代码压缩
			 *
			 * @type {Boolean}
			 */
			minFuncCode: false,
			/**
			 * 压缩插入到代码中的翻译结果JSON
			 *
			 * @remark 设置true，会导致 I18NHandler.style.comment4nowords 失效
			 * @type {Boolean}
			 */
			minFuncJSON: false,
			/**
			 * 在源代码中，输出所有提取的关键字中，没有翻译结果的关键字，以注释的形式插入
			 * @type {Boolean}
			 */
			comment4nowords: true,

			proxyGlobalHandler:
			{
				/**
				 * 在I18N函数体内，调用外部函数，代替插入过多代码的方式
				 *
				 * 即使不使用此参数，也可以使用如下特定的写法，告诉工具，生成globalfunc 代替 fullfunc
 				 * function I18N(msg){return ''+topI18NHandler(msg, arguments);}
 				 * 注意：此配置只会影响没有进行插装，如果要全部更新，需要配置 upgrade.partial false
 				 * 注意：更新函数版本号，不会触发此更新
				 * @type {Boolean}
				 */
				enable: false,
				/**
				 * 调用的外部函数名
				 *
				 * @type {String}
				 */
				name: 'topI18N',
				/**
				 * 忽略源代码中解析出来的原来的函数名，强制使用配置的函数名
 				 *
 				 * @remark 如果原来有值，但不同，会触发更新；原来没有，则不会进行更新
				 * @type {Boolean}
				 */
				ignoreFuncCode: false,
			},
		},
		insert:
		{
			/**
			 * 是否插入新的I18NHandler函数
			 *
			 * @type {Boolean}
			 */
			enable: true,
			/**
			 * 插入I18N函数前，检查所在位置，是否闭包
			 *
			 * @type {Boolean}
			 */
			checkClosure: true,
			/**
			 * 插入I18N函数时，优先插入到define函数中
			 *
			 * @type {Boolean}
			 */
			priorityDefineHalder: true,
		},
		tpl:
		{
			/**
			 * js代码中，获取当前语言包的代码
			 *
			 * string，即全局的函数调用
 			 * function，必须是可被序列化成字符串，能独立运行
 			 *
			 * @type {String|Function}
			 */
			getLanguageCode: getLanguageCodeHandler,
			/**
			 * 对GetLanguageCode中的变量$LanguageVars.name$进行替换
			 *
			 * @type {Object}
			 */
			languageVars:
			{
				/**
				 * 通用语言包变量
				 *
				 * @type {String}
				 */
				name: '__i18n_lan__',
				/**
				 * 通用语言包变量-cookie版
				 *
				 * @type {String}
				 */
				cookie: 'proj.i18n_lan',
			},
			/**
			 * 新插入的I18N函数外部包裹内容-开始部分
			 *
			 * @type {String}
			 */
			newHeaderCode: '\n\n/* eslint-disable */\n',
			/**
			 * 新插入的I18N函数外部包裹内容-结束部分
			 *
			 * @type {String}
			 */
			newFooterCode: '\n/* eslint-enable */\n\n',
		},
	},

	/**
	 * 设置修改源码的区间
	 *
	 * 如果去掉TranslateWord，
	 * 配合最后输出的I18NArgsTranslateWords和codeTranslateWords，
 	 * 可以实现check效果
 	 *
	 * @remark 空数据则关闭所有，空对象则使用默认
	 * @type {Object|Array}
	 */
	codeModifyItems: new utils.FeatureEnableOnly(
	{
		// I18NHandler 已经改名为 I18NHandler.upgrade.enable
		// I18NHandler: true,
		/**
		 * 将分词的结果，用I18N函数包裹起来
		 *
		 * @type {Boolean}
		 */
		TranslateWord: true,
		/**
		 * TranslateWord中的RegExp类型
		 *
		 * @type {Boolean}
		 */
		TranslateWord_RegExp: false,
		/**
		 * 将I18NHandlerAlias统一成I18NHandlerName
		 *
		 * @type {Boolean}
		 */
		I18NHandlerAlias: true
	}),

	/**
	 * 启用的插件
	 *
	 * @remark 空数据则关闭所有，空对象则使用默认
	 * @type {Object|Array}
	 */
	pluginEnabled: new utils.FeatureEnableOnly({}),
	/**
	 * 插件配置
	 *
	 * @type {Object}
	 */
	pluginSettings: {},

	/**
	 * 是否忽略向前兼容逻辑
	 *
	 * @type {Boolean}
	 */
	depdEnable: true,

	/**
	 * 对外事件暴露
	 *
	 * @type {Object}
	 */
	events:
	{
		loadTranslateJSON: null,
		newTranslateJSON: null,
		beforeScan: null,
		cutword: null,
		assignLineStrings: null,
	},
};

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


utils.freeze(exports.defaults);
exports.extend = function(obj)
{
	return utils.extend(exports.defaults, obj);
};

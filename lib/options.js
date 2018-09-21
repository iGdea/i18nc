/* eslint-disable no-control-regex */

'use strict';

var getLanguageCodeHandler = require('./upgrade/tpl/getlanguagecode_handler');
var utils = require('./utils/options_utils');


exports.defaults =
{
	/**
	 * 提取分词的正则
	 *
	 * 前后两个匹配，是为了尽可能匹配多的字符
 	 * 排除所有的ascii字符，https://zh.wikipedia.org/wiki/ASCII
 	 * 排除 "' 是因为tag标签属性用这个分隔，而本身很少用这两个引号
 	 * 排除 <> 是因为html标签
 	 *
	 * @type {RegExp|null}
	 * @default 排除所有ascii字符的正则
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
	 * 这些函数里面的调用或则声明，不进行扫描
	 *
	 * @remark 函数名带有.，表示对成员方法的调用
	 * @type {Object|Array}
	 * @default [console.xxxx]
	 */
	ignoreScanHandlerNames:
	{
		'console.log'	: true,
		'console.warn'	: true,
		'console.trace'	: true,
		'console.info'	: true,
		'console.error'	: true,
		'console.dir'	: true,
		'console.table'	: true,
	},

	/**
	 * 外部导入的翻译数据
	 *
	 * @type {Object}
	 */
	dbTranslateWords: null,

	/**
	 * 注入到代码中的I18N函数的定制化配置
	 *
	 * @type {Object}
	 */
	I18NHandler:
	{
		data:
		{
			/**
			 * 函数默认标识，可标识出特定的I18N函数体
			 * 一般用文件的相对路径
			 *
			 * @remark 可以针对filekey，可以提供定制翻译结果
			 * @type {String}
			 */
			defaultFileKey: '*',
			/**
			 * 只打包这个列表的语言包到代码中
			 *
			 * @remark 数组为空则不受限制，传入多少种语言，就打包多少种
			 * @type {Array}
			 */
			onlyTheseLanguages: [],
			/**
			 * 翻译的时候，不参考代码中I18N里面的数据
			 *
			 * @remark 启动后，如果dbTranslateWords没有数据，直接删除在I18N已有的翻译
			 * @type {Boolean}
			 */
			ignoreFuncWords: false,
		},
		upgrade:
		{
			/**
			 * [总开关]能否更新已插入代码中I18N函数体
			 *
			 * @remark 已经初始化的I18N函数，不会主动更新
			 * @type {Boolean}
			 */
			enable: true,
			/**
			 * 优先进行I18N函数的局部更新（只更新翻译数据）
			 *
			 * @remark 是否能进行局部更新，受到众多因素影响，这只是一个开关
			 * @type {Boolean}
			 */
			partial: true,
			/**
			 * 函数版本号不同的时候，是否更新整个函数体
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
			 * 优先使用的代码风格（fullHandler/proxyGlobalHandler）
			 *
			 * @type {String}
			 */
			codeStyle: 'fullHandler',

			/**
			 * 对插入的I18N进行代码压缩
			 *
			 * @type {Boolean}
			 */
			minFuncCode: false,
			/**
			 * 对插入到代码中的翻译结果JSON进行代码压缩
			 *
			 * @remark 设置true，会导致 I18NHandler.style.comment4nowords 失效
			 * @type {Boolean}
			 */
			minFuncJSON: false,
			/**
			 * 翻译结果JSON，输出所有提取到的关键字；没有翻译结果的关键字，以注释的形式插入
			 *
			 * @type {Boolean}
			 */
			comment4nowords: true,

			/**
			 * 在I18N函数体内，调用外部函数，代替插入过多代码的方式
			 *
			 * @type {Object}
			 */
			proxyGlobalHandler:
			{
				/**
				 * 调用的外部函数名
				 *
				 * @type {String}
				 */
				name: 'topI18N',
				/**
				 * 将源码中类proxyGlobal写法的I18N函数，转换为标准的proxyGlobalHandler
				 *
				 * @type {Boolean}
				 */
				autoConvert: true,
				/**
				 * 已经转的函数，是否维持此状态
				 *
				 * @remark 权重高于autoConvert
				 * @type {Boolean}
				 */
				keepThisStyle: true,
				/**
				 * 忽略源代码中解析出来的外部函数名，强制使用配置的函数名
 				 *
 				 * @remark 如果原来有值，但不同，会触发更新；原来没有，则不会进行更新
				 * @type {Boolean}
				 */
				ignoreFuncCodeName: false,
			},
			/**
			 * 插入完整的I18N函数体，代码不依赖外部任何库或者函数
			 *
			 * @type {Object}
			 */
			fullHandler:
			{
				/**
				 * 将源码中类fullHandler写法的I18N函数，转换为标准的fullHandler
				 *
				 * @type {Boolean}
				 */
				autoConvert: true,
				/**
				 * 已经转的函数，是否维持此状态
				 *
				 * @remark 权重高于autoConvert
				 * @type {Boolean}
				 */
				keepThisStyle: true,
			},
		},
		insert:
		{
			/**
			 * [总开关]是否插入新的I18N函数
			 *
			 * @type {Boolean}
			 */
			enable: true,
			/**
			 * 插入I18N函数前，检查插入位置，作用域不能是全局，必须闭包
			 *
			 * @type {Boolean}
			 */
			checkClosure: true,
			/**
			 * 优先将新的I18N函数插入到define函数体中
			 *
			 * @type {Boolean}
			 */
			priorityDefineHalder: true,
		},
		tpl:
		{
			/**
			 * I18N函数体中，获取当前语言包的JS业务代码
			 *
			 * string，即全局的函数调用
 			 * function，必须是可被序列化成字符串，能独立运行
 			 *
			 * @type {String|Function}
			 */
			getLanguageCode: getLanguageCodeHandler,
			/**
			 * getLanguageCode中可替换$LanguageVars.xxxx$的变量
			 *
			 * @type {Object}
			 */
			languageVars:
			{
				/**
				 * 获取语言包通用变量
				 *
				 * @type {String}
				 */
				name: '__i18n_lan__',
				/**
				 * 获取语言包通用变量-cookie版
				 *
				 * @type {String}
				 */
				cookie: 'proj.i18n_lan',
			},
			/**
			 * 新插入的I18N函数外包裹的内容-开始部分
			 *
			 * @type {String}
			 */
			newHeaderCode: '\n\n/* eslint-disable */\n',
			/**
			 * 新插入的I18N函数外包裹的内容-结束部分
			 *
			 * @type {String}
			 */
			newFooterCode: '\n/* eslint-enable */\n\n',
		},
	},

	/**
	 * 设置操作的源码可修改的内容
	 *
	 * 如果去掉TranslateWord，
	 * 配合最后输出的I18NArgsTranslateWords和codeTranslateWords，
 	 * 可以实现check效果
 	 *
	 * @remark 空数据则关闭所有，空对象则使用默认
	 * @type {Object|Array}
	 */
	codeModifyItems:
	{
		// I18NHandler 已经改名为 I18NHandler.upgrade.enable
		// I18NHandler: true,
		/**
		 * 将提取的需要翻译的关键字，使用I18N函数包裹起来
		 *
		 * @type {Boolean}
		 */
		TranslateWord: true,
		/**
		 * 同TranslateWord，RegExp类型的开关
		 *
		 * @type {Boolean}
		 */
		TranslateWord_RegExp: false,
		/**
		 * 将I18NHandlerAlias替换成I18NHandlerName
		 *
		 * @type {Boolean}
		 */
		I18NHandlerAlias: true
	},

	/**
	 * 当前安装和启用的插件
	 *
	 * @remark 空数据则关闭所有，空对象则使用默认
	 * @type {Object|Array}
	 */
	pluginEnabled: {},
	/**
	 * 插件的配置
	 *
	 * @type {Object}
	 */
	pluginSettings: {},

	/**
	 * 是否开启向前版本兼容逻辑
	 *
	 * @remark 向前兼容需要消耗一定的计算资源和时间，建议按照提示修改成最新的配置和接口
	 * @type {Boolean}
	 */
	depdEnable: true,

	/**
	 * 面向定制化的监听事件
	 *
	 * @type {Object}
	 */
	events:
	{
		/**
		 * 从源码I18N函数体中提取到翻译数据时触发，可修改数据
		 *
		 * @type {Function}
		 */
		loadTranslateJSON: null,
		/**
		 * 生成新的I18N函数时触发，可对翻译数据进行再加工
		 *
		 * @type {Function}
		 */
		newTranslateJSON: null,
		/**
		 * 逐步扫描源码ast树时触发，可对ast结构进行预处理&判断
		 *
		 * @type {Function}
		 */
		beforeScan: null,
		/**
		 * 分词之后触发，可对分词结果进行优化
		 *
		 * @type {Function}
		 */
		cutword: null,
		/**
		 * 将分词结果绑定ast时触发，可调整分词和ast的对应关系
		 *
		 * @type {Function}
		 */
		assignLineStrings: null,
	},
};


utils.freeze(exports.defaults);
exports.extend = function(obj)
{
	return utils.extend(exports.defaults, obj);
};

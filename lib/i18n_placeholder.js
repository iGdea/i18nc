'use strict';

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:i18n_placeholder');
var DEF				= require('./def');
var emitter			= require('./emitter');
var astUtils		= require('./ast_utils');
var i18nTpl			= require('./i18n_func/render');
var i18nParser		= require('./i18n_func/parser');
var i18nGenerator	= require('./i18n_func/generator');
var i18nGeneratorV1	= require('./upgrade/i18n_func/generator_v1');
var utils			= require('./utils/utils');
var LanguageVarsReg	= /\$LanguageVars\.([\w$]+)\$/g;

exports.I18NPlaceholder = I18NPlaceholder;

// ast 解析的时候，必须要有range
function I18NPlaceholder(codeTranslateWords, completedCode, options, originalAst)
{
	this.codeTranslateWords	= codeTranslateWords;
	this.completedCode		= completedCode;
	this.options			= options;
	this.originalAst		= originalAst;

	this.renderType			= null;
	this.handlerName		= null;
	this._parseResult		= null;
}

_.extend(I18NPlaceholder.prototype,
{
	toString: function()
	{
		var options = this.options;
		var renderType = this.getRenderType();
		debug('renderType:%s', renderType);

		switch(renderType)
		{
			case 'partial':
				return this._updatePartialCode();

			case 'original':
				return this.originalAst ? this._keepOldCode() : '';

			case 'empty':
				return '';

			case 'simple':
				return this._updateSimpleFunctionCode();

			case 'complete':
			default:
				var newCode = this._updateTotalCode();
				// 如果没有originalAst，表明是新的code，那么就多添加两个换行吧
				if (!this.originalAst)
				{
					newCode = '\n'
						+ options.I18NHandler.tpl.newHeaderCode
						+ newCode
						+ options.I18NHandler.tpl.newFooterCode
						+ '\n';
				}

				return newCode;
		}
	},
	getRenderType: function()
	{
		var options = this.options;
		if (this.renderType) return this.renderType;
		if (!options.I18NHandler.upgrade.enable) return 'original';

		var funcInfo = this.parse();
		if (funcInfo.isNotI18NHandler)
		{
			// 判断是否不需要插入新的i18n函数，直接使用原来代码
			var codeTranslateWords = this.codeTranslateWords || {};
			var defaults_length = codeTranslateWords.DEFAULTS
					&& codeTranslateWords.DEFAULTS.length;
			var subtypes_length = codeTranslateWords.SUBTYPES
					&& Object.keys(codeTranslateWords.SUBTYPES).length;

			if (!defaults_length && !subtypes_length)
			{
				debug('ignore generate I18NHandler');
				return 'original';
			}
		}
		else
		{
			var I18NHandlerConfig = options.I18NHandler;
			var I18NHandlerStyleConfig = I18NHandlerConfig.style;
			var proxyGlobalHandlerConfig = I18NHandlerStyleConfig.proxyGlobalHandler;
			var fullHandlerConfig = I18NHandlerStyleConfig.fullHandler;
			var FUNCTION_VERSION = funcInfo.__FUNCTION_VERSION__ || '';
			// 只更新翻译数据
			// 值为true，则此项安全，可以进行局部更新
			var checkPartialItems =
			{
				options					: I18NHandlerConfig.upgrade.partial,
				originalAst				: this.originalAst,
				translateJSON			: funcInfo.__TRANSLATE_JSON__ast,
				handlerName				: !this.handlerName
					|| funcInfo.handlerName == this.handlerName,
				I18NFunctionVersion		: !I18NHandlerConfig.upgrade.checkVersion
					|| FUNCTION_VERSION[0] == DEF.I18NFunctionVersion,

				// 代码风格判断
				fullHandler				: fullHandlerConfig.keepThisStyle
					|| FUNCTION_VERSION[1] != DEF.I18NFunctionSubVersion.FULL,
				proxyGlobalHandler		: proxyGlobalHandlerConfig.keepThisStyle
					|| FUNCTION_VERSION[1] != DEF.I18NFunctionSubVersion.GLOBAL,
				proxyGlobalHandlerName	: !(proxyGlobalHandlerConfig.ignoreFuncCodeName
					&& funcInfo.globalHandlerName
					&& funcInfo.globalHandlerName != proxyGlobalHandlerConfig.name)
			};
			var ret = _.some(checkPartialItems, function(val, name)
			{
				if (val) return false;

				switch(name)
				{
					case 'handlerName':
						debug('not partial, because %s <funcInfo:%s, this:%s>',
							name, funcInfo.handlerName, this.handlerName);
						break;

					case 'I18NFunctionVersion':
						debug('not partial, because %s <funcInfo:%s DEF:%s>',
							name, funcInfo.__FUNCTION_VERSION__,
							DEF.I18NFunctionVersion);
						break;

					case 'proxyGlobalHandlerName':
						debug('not partial, because %s <funcInfo:%s option:%s>',
							name, funcInfo.globalHandlerName, proxyGlobalHandlerConfig.name);
						break;

					default:
						debug('not partial, because %s: %o', name, val);
				}

				return true;
			});

			if (!ret) return 'partial';
		}

		return 'complete';
	},
	parse: function()
	{
		var options = this.options;
		if (!this._parseResult)
		{
			if (this.originalAst)
			{
				this._parseResult = i18nParser.parse(this.originalAst, options);
				// 处理解析出来的handler
				// this._parseResult.handlerName = this.originalAst.id && this.originalAst.id.name;
			}

			if (!this._parseResult || !this._parseResult.__FILE_KEY__)
			{
				this._parseResult = _.extend(
					{
						handlerName				: options.I18NHandlerName,
						__FILE_KEY__			: options.I18NHandler.data.defaultFileKey,
						__FUNCTION_VERSION__	: DEF.I18NFunctionVersion,
						__TRANSLATE_JSON__		: {}
					},
					this._parseResult,
					{isNotI18NHandler: true});
			}
		}

		return this._parseResult;
	},
	getTranslateJSON: function()
	{
		return this._getI18NGenerator()
			.getTranslateJSON(this._getTranslateJSONArgs());
	},
	_getI18NGenerator: function()
	{
		var funcInfo = this.parse();
		var funcVersion = funcInfo.__FUNCTION_VERSION__;

		return !funcVersion || !utils.ltI18NFuncVersion(funcVersion, 'G')
			? i18nGenerator : i18nGeneratorV1;
	},
	_getRenderTranslateJSONCode: function()
	{
		var options = this.options;
		if (options.I18NHandler.upgrade.updateJSON)
		{
			return this._getNewRenderTranslateJSONCode();
		}
		else
		{
			return this._getOldRenderTranslateJSONCode();
		}
	},
	_getOldRenderTranslateJSONCode: function()
	{
		var funcInfo = this.parse();

		if (funcInfo.__TRANSLATE_JSON__ast)
		{
			var range = funcInfo.__TRANSLATE_JSON__ast.range;
			var code = this.completedCode.slice(range[0], range[1]);

			// 需要去掉原来的缩进，后面的逻辑会重新计算缩进
			var codeArr = code.split('\n');
			if (codeArr.length > 1)
			{
				var rmBlank = codeArr[codeArr.length-1].match(/^\s+/);
				debug('rmBlank:%o', rmBlank);
				if (rmBlank)
				{
					rmBlank = rmBlank[0];
					var rmBlankLen = rmBlank.length;
					code = codeArr.map(function(str)
					{
						return str.substr(0, rmBlankLen) == rmBlank
							? str.substr(rmBlankLen) : str;
					})
					.join('\n');
				}
			}

			return code;
		}

		return '{}';
	},
	_getNewRenderTranslateJSONCode: function()
	{
		var options = this.options;
		var translateJSON = this.getTranslateJSON();
		var myI18NGenerator = this._getI18NGenerator();
		if (options.I18NHandler.style.comment4nowords)
		{
			myI18NGenerator.fillNoUsedCodeTranslateWords(
				translateJSON,
				this.codeTranslateWords,
				options.I18NHandler.data.defaultLanguage
			);
		}
		var translateJSONCode = myI18NGenerator.genTranslateJSONCode(translateJSON);

		var emitData =
		{
			result			: translateJSONCode,
			options			: options,
			original		: translateJSONCode,
			originalJSON	: translateJSON
		};

		emitter.trigger('newTranslateJSON', emitData);

		return ''+emitData.result;
	},
	_getTranslateJSONArgs: function()
	{
		var options = this.options;
		var funcInfo = this.parse();
		var ignoreFuncWords = options.I18NHandler.data.ignoreFuncWords;

		return {
			FILE_KEY			: funcInfo.__FILE_KEY__,
			onlyTheseLanguages	: options.I18NHandler.data.onlyTheseLanguages,
			funcTranslateWords	: ignoreFuncWords ? null : funcInfo.__TRANSLATE_JSON__,
			dbTranslateWords	: options.dbTranslateWords,
			codeTranslateWords	: this.codeTranslateWords
		};
	},
	_updatePartialCode: function()
	{
		var options = this.options;
		var funcInfo = this.parse();
		var newJSONCode = this._getRenderTranslateJSONCode();

		// 压缩这个代码的时候，需要加上()
		// 不然esprima会报错
		if (options.I18NHandler.style.minFuncJSON)
		{
			newJSONCode = astUtils.mincode('('+newJSONCode+')').slice(1);
			// 删除添加的)的时候，要考虑到escodegen会多加一个;
			// 所以用一个for循环来删除最后的)
			for(var i = newJSONCode.length; i--;)
			{
				if (newJSONCode[i] == ')')
				{
					newJSONCode = newJSONCode.slice(0, i);
					break;
				}
			}
		}

		newJSONCode = this._beautifyCode(newJSONCode, funcInfo.__TRANSLATE_JSON__ast);

		var json_ast_range = funcInfo.__TRANSLATE_JSON__ast.range;
		var newCode = this.completedCode.slice(this.originalAst.range[0], json_ast_range[0])
			+ newJSONCode
			+ this.completedCode.slice(json_ast_range[1], this.originalAst.range[1]);

		return newCode;
	},
	_updateTotalCode: function()
	{
		var options = this.options;
		var isMinCode = options.I18NHandler.style.minFuncCode;
		var funcInfo = this.parse();
		var TRANSLATE_JSON_CODE = this._getRenderTranslateJSONCode();

		// 添加的代码缩进：多一个tab
		// 将这个tab放到了render函数中做
		// TRANSLATE_JSON_CODE = TRANSLATE_JSON_CODE.split('\n').join('\n\t');
		var getLanguageCode = options.I18NHandler.tpl.getLanguageCode;

		if (typeof getLanguageCode == 'function')
		{
			getLanguageCode = getLanguageCode.toString();
		}
		getLanguageCode = getLanguageCode.trim();

		if (isMinCode)
		{
			getLanguageCode = i18nTpl.min(
					getLanguageCode.replace(/^function\s*\(/, 'function a(')
				);
		}

		getLanguageCode = getLanguageCode.replace(/^function \s*[\w$]+\s*\(/, 'function(');
		if (getLanguageCode.substr(0, 9) == 'function(')
		{
			getLanguageCode = '('+getLanguageCode+')';
		}


		var languageVars = options.I18NHandler.tpl.languageVars || {};
		getLanguageCode = getLanguageCode.replace(LanguageVarsReg, function(all, name)
		{
			return languageVars[name] || all;
		});


		// 更新整个函数
		var renderData =
		{
			handlerName			: this.handlerName || funcInfo.handlerName || options.I18NHandlerName,
			getLanguageCode		: getLanguageCode,
			FILE_KEY			: funcInfo.__FILE_KEY__,
			FUNCTION_VERSION	: DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.FULL,
			TRANSLATE_JSON_CODE	: TRANSLATE_JSON_CODE,
		};

		var newCode;
		var I18NHandlerStyleConfig = options.I18NHandler.style;
		var proxyGlobalHandlerConfig = I18NHandlerStyleConfig.proxyGlobalHandler;
		var useFullHanlder = I18NHandlerStyleConfig.fullHandler.autoConvert
				&& funcInfo.codeStyle == 'fullHandler';
		var useProxyGlobalHandler = !useFullHanlder
				&& I18NHandlerStyleConfig.codeStyle == 'proxyGlobalHandler';

		if ((proxyGlobalHandlerConfig.autoConvert && funcInfo.codeStyle == 'proxyGlobalHandler')
			// 初始化的时候，使用global进行初始化
			|| (useProxyGlobalHandler && funcInfo.isNotI18NHandler)
			// 启动全量更新，同时启动globalHandler
			|| (useProxyGlobalHandler && !options.I18NHandler.upgrade.partial))
		{
			renderData.globalHandlerName = proxyGlobalHandlerConfig.ignoreFuncCodeName
				? proxyGlobalHandlerConfig.name
				: funcInfo.globalHandlerName || proxyGlobalHandlerConfig.name;
			renderData.FUNCTION_VERSION = DEF.I18NFunctionVersion
				+ DEF.I18NFunctionSubVersion.GLOBAL;

			debug('i18n global function renderdata: %o', renderData);
			newCode = i18nTpl.renderGlobal(renderData, isMinCode);
		}
		else
		{
			debug('i18n full fucntion renderdata: %o', renderData);
			newCode = i18nTpl.render(renderData, isMinCode);
		}

		return this._beautifyCode(newCode, this.originalAst);
	},

	_keepOldCode: function()
	{
		var old_range = this.originalAst.range;
		return this.completedCode.slice(old_range[0], old_range[1]);
	},

	_updateSimpleFunctionCode: function()
	{
		var options = this.options;
		var isMinCode = options.I18NHandler.style.minFuncCode;
		var funcInfo = this.parse();
		var SIMPLE_VERSION = DEF.I18NFunctionVersion + DEF.I18NFunctionSubVersion.SIMPLE;

		if (funcInfo.__FUNCTION_VERSION__ == SIMPLE_VERSION)
		{
			return this._keepOldCode();
		}

		var newCode = i18nTpl.renderSimple(
			{
				FILE_KEY: funcInfo.__FILE_KEY__,
				FUNCTION_VERSION: SIMPLE_VERSION,
				handlerName: this.handlerName || funcInfo.handlerName || options.I18NHandlerName,
			},
			isMinCode);

		newCode = this._beautifyCode(newCode, this.originalAst);

		return newCode;
	},

	_beautifyCode: function(code, ast)
	{
		// 获取原来代码锁进
		var codeIndent = '';
		if (ast)
		{
			codeIndent = astUtils.codeIndent(ast, this.completedCode);
			debug('codeIndent:%s, len:%d', codeIndent, codeIndent.length);
		}

		return code.split('\n').join('\n'+codeIndent);
	}
});

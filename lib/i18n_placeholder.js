'use strict';

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:i18n_placeholder');
var DEF				= require('./def');
var emitter			= require('./emitter');
var astUtils		= require('./ast_utils');
var i18nTpl			= require('./i18n_func/render');
var i18nParser		= require('./i18n_func/parser');
var i18nGenerator	= require('./i18n_func/generator');


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
						+ options.I18NHandlerTPL_NewHeaderCode
						+ newCode
						+ options.I18NHandlerTPL_NewFooterCode
						+ '\n';
				}

				return newCode;
		}
	},
	getRenderType: function()
	{
		var options = this.options;
		if (this.renderType) return this.renderType;
		if (!options.codeModifiedArea.I18NHandler) return 'original';

		var funcInfo = this.parse();
		if (funcInfo.isNotI18NHanlder)
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
			// 只更新翻译数据
			// 值为true，则此项安全，可以进行局部更新
			var checkPartialItems =
			{
				options					: options.isPartialUpdate,
				originalAst				: this.originalAst,
				translateJSON			: funcInfo.__TRANSLATE_JSON__ast,
				handlerName				: !this.handlerName || funcInfo.handlerName == this.handlerName,
				I18NFunctionVersion		: funcInfo.__FUNCTION_VERSION__
					&& funcInfo.__FUNCTION_VERSION__.split('.')[0] == DEF.I18NFunctionVersion,
				proxyGlobalHandlerName	: !(options.isProxyGlobalHandler
					&& options.isIgnoreCodeProxyGlobalHandlerName
					&& funcInfo.globalHandlerName
					&& funcInfo.globalHandlerName != options.proxyGlobalHandlerName)
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
							name, funcInfo.globalHandlerName,
							options.proxyGlobalHandlerName);
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
				this._parseResult =
				{
					isNotI18NHanlder		: true,
					handlerName				: options.I18NHandlerName,
					globalHandlerName		: this._parseResult && this._parseResult.globalHandlerName,
					__FILE_KEY__			: options.defaultFileKey,
					__FUNCTION_VERSION__	: DEF.I18NFunctionVersion,
					__TRANSLATE_JSON__		: {},
				};
			}
		}

		return this._parseResult;
	},
	getTranslateJSON: function()
	{
		return i18nGenerator.getTranslateJSON(this._getTranslateJSONArgs());
	},
	_getRenderTranslateJSONCode: function()
	{
		var options = this.options;
		var translateJSON = this.getTranslateJSON();
		if (options.isInjectAllTranslateWords)
		{
			i18nGenerator.fillNoUsedCodeTranslateWords(
				translateJSON,
				this.codeTranslateWords,
				options.defaultTranslateLanguage
			);
		}
		var translateJSONCode = i18nGenerator.genTranslateJSONCode(translateJSON);

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
		var noFuncTranslateWords = options.isIgnoreI18NHandlerTranslateWords;

		return {
			FILE_KEY			: funcInfo.__FILE_KEY__,
			pickFileLanguages	: options.pickFileLanguages,
			funcTranslateWords	: noFuncTranslateWords ? null : funcInfo.__TRANSLATE_JSON__,
			dbTranslateWords	: options.dbTranslateWords,
			codeTranslateWords	: this.codeTranslateWords
		};
	},
	_updatePartialCode: function()
	{
		var funcInfo = this.parse();
		var newJSONCode = this._getRenderTranslateJSONCode();

		// 压缩这个代码的时候，需要加上()
		// 不然esprima会报错
		newJSONCode = this._beautifyCode('('+newJSONCode+')', funcInfo.__TRANSLATE_JSON__ast).slice(1);

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

		var json_ast_range = funcInfo.__TRANSLATE_JSON__ast.range;
		var newCode = this.completedCode.slice(this.originalAst.range[0], json_ast_range[0])
			+ newJSONCode
			+ this.completedCode.slice(json_ast_range[1], this.originalAst.range[1]);

		return newCode;
	},
	_updateTotalCode: function()
	{
		var options = this.options;
		var isMinCode = options.minTranslateFuncCode == 'all'
			|| options.minTranslateFuncCode == 'onlyFunc';
		var funcInfo = this.parse();
		var TRANSLATE_JSON_CODE = this._getRenderTranslateJSONCode();

		// 添加的代码缩进：多一个tab
		// 将这个tab放到了render函数中做
		// TRANSLATE_JSON_CODE = TRANSLATE_JSON_CODE.split('\n').join('\n\t');
		var GetLanguageCode = options.I18NHandlerTPL_GetLanguageCode;

		if (typeof GetLanguageCode == 'function')
		{
			GetLanguageCode = GetLanguageCode.toString();
		}
		GetLanguageCode = GetLanguageCode.trim();

		if (isMinCode)
		{
			GetLanguageCode = i18nTpl.min(GetLanguageCode.replace(/^function\s*\(/, 'function a('));
		}

		GetLanguageCode = GetLanguageCode.replace(/^function \s*[\w$]+\s*\(/, 'function(');
		if (GetLanguageCode.substr(0, 9) == 'function(')
		{
			GetLanguageCode = '('+GetLanguageCode+')';
		}


		var LanguageVars = options.I18NHandlerTPL_LanguageVars || {};
		GetLanguageCode = GetLanguageCode.replace(/\$LanguageVars\.([\w$]+)\$/g, function(all, name)
		{
			return LanguageVars[name];
		});


		// 更新整个函数
		var renderData =
		{
			handlerName			: this.handlerName || funcInfo.handlerName || options.I18NHandlerName,
			FILE_KEY			: funcInfo.__FILE_KEY__,
			FUNCTION_VERSION	: DEF.I18NFunctionVersion,
			GetLanguageCode		: GetLanguageCode,
			TRANSLATE_JSON_CODE	: TRANSLATE_JSON_CODE,
		};

		var newCode;

		if (funcInfo.globalHandlerName
			// 初始化的时候，使用global进行初始化
			|| (options.isProxyGlobalHandler && funcInfo.isNotI18NHanlder)
			// 启动全量更新，同时启动globalHandler
			|| (options.isProxyGlobalHandler && !options.isPartialUpdate))
		{
			renderData.globalHandlerName = options.isIgnoreCodeProxyGlobalHandlerName
				? options.proxyGlobalHandlerName
				: funcInfo.globalHandlerName || options.proxyGlobalHandlerName;
			renderData.FUNCTION_VERSION = renderData.FUNCTION_VERSION.split('.')[0]
				+ '.' + DEF.I18NFunctionSubVersion.GLOBAL;

			debug('i18n global function renderdata: %o', renderData);
			newCode = i18nTpl.renderGlobal(renderData, isMinCode);
		}
		else
		{
			debug('i18n fucntion renderdata: %o', renderData);
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
		var isMinCode = options.minTranslateFuncCode == 'all'
			|| options.minTranslateFuncCode == 'onlyFunc';
		var funcInfo = this.parse();
		var SIMPLE_VERSION = DEF.I18NFunctionVersion+'.'
				+ DEF.I18NFunctionSubVersion.SIMPLE;

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
		if (this.options.minTranslateFuncCode == 'all')
		{
			return astUtils.mincode(code);
		}

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

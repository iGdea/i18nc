'use strict';

var _ = require('lodash');
var deprecate = require('depd')('i18nc-core:options');
var GetLanguageCodeDepd = require('./tpl/depd_getlanguagecode_handler').toString();
var valUtils = require('../utils/options_vals.js');
var OptionsVals = valUtils.OptionsVals;


var OPTIONS_RENAME_MAP = exports.OPTIONS_RENAME_MAP =
{
	cutWordReg: 'cutwordReg',
	handlerName: 'I18NHandlerName',

	defaultFileKey: 'I18NHandler.data.defaultFileKey',
	// defaultTranslateLanguage: 'I18NHandler.data.defaultLanguage',
	pickFileLanguages: 'I18NHandler.data.onlyTheseLanguages',
	isIgnoreI18NHandlerTranslateWords: 'I18NHandler.data.ignoreFuncWords',

	isPartialUpdate: 'I18NHandler.upgrade.partial',

	// minTranslateFuncCode: 'I18NHandler.style.minFuncCode',
	// minTranslateFuncCode: 'I18NHandler.style.minFuncJSON',
	// isMinFuncTranslateCode: 'I18NHandler.style.minFuncJSON',
	isInjectAllTranslateWords: 'I18NHandler.style.comment4nowords',

	// isProxyGlobalHandler: 'I18NHandler.style.proxyGlobalHandler.enable',
	proxyGlobalHandlerName: 'I18NHandler.style.proxyGlobalHandler.name',
	isIgnoreCodeProxyGlobalHandlerName: 'I18NHandler.style.proxyGlobalHandler.ignoreFuncCodeName',


	isCheckClosureForNewI18NHandler: 'I18NHandler.insert.checkClosure',
	isClosureWhenInsertedHead: 'I18NHandler.insert.checkClosure',
	isInsertToDefineHalder: 'I18NHandler.insert.priorityDefineHalder',


	I18NHandlerTPL_GetLanguageCode: 'I18NHandler.tpl.getLanguageCode',
	I18NHandlerTPL_LanguageVars: 'I18NHandler.tpl.languageVars',
	I18NHandlerTPL_NewHeaderCode: 'I18NHandler.tpl.newHeaderCode',
	I18NHandlerTPL_NewFooterCode: 'I18NHandler.tpl.newFooterCode',

	I18NhandlerTpl_GetLanguageCode: 'I18NHandler.tpl.getLanguageCode',
	I18NhandlerTpl_LanguageVars: 'I18NHandler.tpl.languageVars',
	I18NhandlerTpl_NewHeaderCode: 'I18NHandler.tpl.newHeaderCode',
	I18NhandlerTpl_NewFooterCode: 'I18NHandler.tpl.newFooterCode',

	I18NhandlerTpl_LanguageVarName: 'I18NHandler.tpl.languageVars.name',
	'I18NhandlerTpl:LanguageVarName': 'I18NHandler.tpl.languageVars.name',

	I18NhandlerTpl_GetGlobalCode: 'I18NHandler.tpl.getLanguageCode',
	'I18NhandlerTpl:GetGlobalCode': 'I18NHandler.tpl.getLanguageCode',

	codeModifiedArea: 'codeModifyItems',
	'codeModifiedArea.I18NHandler': 'I18NHandler.upgrade.enable',

	'I18NHandler.upgrade.version': 'I18NHandler.upgrade.checkVersion',
	'I18NHandler.style.proxyGlobalHandler.ignoreFuncCode': 'I18NHandler.style.proxyGlobalHandler.ignoreFuncCodeName',

	loadTranslateJSON: 'events.loadTranslateJSON',
	newTranslateJSON: 'events.newTranslateJSON',
	beforeScan: 'events.beforeScan',
	cutword: 'events.cutword',
	assignLineStrings: 'events.assignLineStrings',
};


var rename_1to1 = (function()
{
	var checkMap = {};
	_.each(OPTIONS_RENAME_MAP, function(newKey, oldKey)
	{
		var config = checkMap[newKey] || (checkMap[newKey] = []);
		config.push(oldKey);
	});


	function repalceKeyValHandler(newKey, oldKey, val)
	{
		switch(oldKey)
		{
			case 'I18NhandlerTpl_GetGlobalCode':
			case 'I18NhandlerTpl:GetGlobalCode':
				val = GetLanguageCodeDepd.replace(/\$GetLanguageCode/, ''+val);
				break;
		}

		deprecate('use `'+newKey+'` instead of `'+oldKey+'`');
		return val;
	}

	return function(optionsVals)
	{
		_.each(checkMap, function(oldKeys, newKey)
		{
			// options已经定义了最新的key
			if (optionsVals.exists(newKey)) return;

			_.some(oldKeys, function(oldKey)
			{
				// 判断老的key，有没有可能存在
				if (optionsVals.exists(oldKey))
				{
					var val = repalceKeyValHandler(newKey, oldKey, optionsVals.getVal(oldKey));
					optionsVals.setVal(newKey, val);
					return true;
				}
			});
		});
	};
})();


var OPTIONS_OLDKEY_MAP = exports.OPTIONS_OLDKEY_MAP =
{
	'minTranslateFuncCode=all':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=true'
		],
	'minTranslateFuncCode=onlyFunc':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=false'
		],
	'minTranslateFuncCode=none':
		[
			'I18NHandler.style.minFuncCode=false',
			'I18NHandler.style.minFuncJSON=false'
		],
	'isMinFuncTranslateCode=true':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=true'
		],
	'isMinFuncTranslateCode=false':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=false'
		],
	'I18NHandler.style.proxyGlobalHandler.enable=true':
		[
			'I18NHandler.style.codeStyle=proxyGlobalHandler'
		],
	'isProxyGlobalHandler=true':
		[
			'I18NHandler.style.codeStyle=proxyGlobalHandler'
		],
}

function rename_1toN(optionsVals)
{
	_.each(OPTIONS_OLDKEY_MAP, function(targetArr, oldKey)
	{
		// 老的key是否定义，值是否满足
		var oldKeyInfo = valUtils.str2keyVal(oldKey);
		if (!optionsVals.exists(oldKeyInfo.key)
			|| optionsVals.getVal(oldKeyInfo.key) !== oldKeyInfo.value)
		{
			return;
		}

		// 判断新的是否已经定义
		var ret = targetArr.some(function(newKey)
		{
			return optionsVals.exists(valUtils.str2keyVal(newKey).key);
		});

		if (ret) return;

		// 值转换
		targetArr.forEach(function(newKey)
		{
			var info = valUtils.str2keyVal(newKey);
			optionsVals.setVal(info.key, info.value);
		});

		deprecate('use `'+targetArr.join(';')+'` instead of `'+oldKey+'`');
	});
}

var OPTIONS_RM_KEYS =
{
	/**
	 * 当没有找到任何语言包 & 启动了comment4nowords, 使用这个语言，作为代码中的语言包
	 * 由于没有任何实际数据，对代码结果无影响
	 *
	 * @type {String}
	 */
	'I18NHandler.data.defaultLanguage': 'en-US',
};

function rmkeys(optionsVals)
{
	_.each(OPTIONS_RM_KEYS, function(defaultVal, key)
	{
		switch(key)
		{
			case 'I18NHandler.data.defaultLanguage':
				if (optionsVals.exists(key))
				{
					deprecate('`'+key+'` will be removed');
				}
				else if (optionsVals.exists('defaultTranslateLanguage'))
				{
					deprecate('`defaultTranslateLanguage` will be removed');
					optionsVals.setVal(key, optionsVals.getVal('defaultTranslateLanguage'));
				}
				else
				{
					optionsVals.setVal(key, defaultVal);
				}
				break;

			default:
				if (optionsVals.exists(key))
					deprecate('`'+key+'` will be removed');
				else
					optionsVals.setVal(key, defaultVal);
		}
	});
}

exports.before = function(options)
{
	var optionsVals = new OptionsVals(options);
	rename_1toN(optionsVals);
	rename_1to1(optionsVals);
}

exports.after = function(result)
{
	var resultVals = new OptionsVals(result);
	rmkeys(resultVals);
};

'use strict';

var _ = require('lodash');
var deprecate = require('depd')('i18nc-core:options');
var GetLanguageCodeDepd = require('./tpl/depd_getlanguagecode_handler').toString();

var OPTIONS_OLDKEY_MAP =
{
	cutWordReg: 'cutwordReg',
	handlerName: 'I18NHandlerName',

	defaultFileKey: 'I18NHandler.data.defaultFileKey',
	defaultTranslateLanguage: 'I18NHandler.data.defaultLanguage',
	pickFileLanguages: 'I18NHandler.data.onlyTheseLanguages',
	isIgnoreI18NHandlerTranslateWords: 'I18NHandler.data.ignoreFuncWords',

	isPartialUpdate: 'I18NHandler.upgrade.partial',

	// minTranslateFuncCode: 'I18NHandler.style.minFuncCode',
	// minTranslateFuncCode: 'I18NHandler.style.minFuncJSON',
	// isMinFuncTranslateCode: 'I18NHandler.style.minFuncJSON',
	isInjectAllTranslateWords: 'I18NHandler.style.comment4nowords',

	isProxyGlobalHandler: 'I18NHandler.style.proxyGlobalHandler.enable',
	proxyGlobalHandlerName: 'I18NHandler.style.proxyGlobalHandler.name',
	isIgnoreCodeProxyGlobalHandlerName: 'I18NHandler.style.proxyGlobalHandler.ignoreFuncCode',


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

	loadTranslateJSON: 'events.loadTranslateJSON',
	newTranslateJSON: 'events.newTranslateJSON',
	beforeScan: 'events.beforeScan',
	cutword: 'events.cutword',
	assignLineStrings: 'events.assignLineStrings',
};


var KEY_ARRS = {};
[
	'I18NHandler.style.minFuncCode',
	'I18NHandler.style.minFuncJSON'
]
.forEach(function(key)
{
	KEY_ARRS[key] = key.split('.');
});

_.each(OPTIONS_OLDKEY_MAP, function(val, key)
{
	if (!KEY_ARRS[val]) KEY_ARRS[val] = val.split('.');
	if (!KEY_ARRS[key]) KEY_ARRS[key] = key.split('.');
});


var rename_1to1 = (function()
{
	var checkMap = {};
	_.each(OPTIONS_OLDKEY_MAP, function(newKey, oldKey)
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

	return function(options)
	{
		_.each(checkMap, function(oldKeys, newKey)
		{
			keyVal1ToKeyVal2(options, newKey, oldKeys, repalceKeyValHandler);
		});
	};
})();


module.exports = function(options)
{
	rename_1to1(options);

	// 老的key，一个对应新的多个key，需要单独处理
	if (!checkKeyVal(options, 'I18NHandler.style.minFuncCode').exists
		&& !checkKeyVal(options, 'I18NHandler.style.minFuncJSON').exists)
	{
		if ('minTranslateFuncCode' in options)
		{
			if (options.minTranslateFuncCode == 'all')
			{
				setKeyVal(options, 'I18NHandler.style.minFuncCode', true);
				setKeyVal(options, 'I18NHandler.style.minFuncJSON', true);
			}
			else if (options.minTranslateFuncCode == 'onlyFunc')
			{
				setKeyVal(options, 'I18NHandler.style.minFuncCode', true);
				setKeyVal(options, 'I18NHandler.style.minFuncJSON', false);
			}

			deprecate('use `I18NHandler.style.minFuncCode/minFuncJSON` instead of `minTranslateFuncCode`');
		}
		else if ('isMinFuncTranslateCode' in options)
		{
			setKeyVal(options, 'I18NHandler.style.minFuncJSON', !!options.isMinFuncTranslateCode);
			setKeyVal(options, 'I18NHandler.style.minFuncCode', true);

			deprecate('use `I18NHandler.style.minFuncCode/minFuncJSON` instead of `isMinFuncTranslateCode`');
		}
	}
}


function keyVal1ToKeyVal2(options, newKey, oldKeys, handler)
{
	// options已经定义了最新的key
	if (checkKeyVal(options, newKey).exists) return;

	_.some(oldKeys, function(oldKey)
	{
		// 判断老的key，有没有可能存在
		var info = checkKeyVal(options, oldKey);
		if (info.exists)
		{
			var val = handler(newKey, oldKey, info.value);
			setKeyVal(options, newKey, val);
			return true;
		}
	});
}

function checkKeyVal(options, key)
{
	var tmpOpt = options;
	var exists = !_.some(KEY_ARRS[key], function(name)
	{
		if (name in tmpOpt)
			tmpOpt = tmpOpt[name];
		else
			return true;
	});

	return {
		exists: exists,
		value: exists ? tmpOpt : undefined,
	};
}

function setKeyVal(options, key, val)
{
	var tmpOpt = options;
	var i = 0;
	var items = KEY_ARRS[key];
	for(var name, t = items.length -1; i < t; i++)
	{
		name = items[i];
		if (!(name in tmpOpt))
			tmpOpt = tmpOpt[name] = {};
		else
			tmpOpt = tmpOpt[name];
	}

	tmpOpt[items[i]] = val;
}

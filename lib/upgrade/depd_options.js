'use strict';

var _ = require('lodash');
var deprecate = require('depd')('i18nc-core:options');
var GetLanguageCodeDepd = require('./tpl/depd_getlanguagecode_handler');

var OPTIONS_OLDKEY_MAP =
{
	cutWordReg: 'cutwordReg',
	handlerName: 'I18NHandlerName',
	isClosureWhenInsertedHead: 'isCheckClosureForNewI18NHandler',
};

['GetLanguageCode', 'LanguageVars', 'NewHeaderCode', 'NewFooterCode'].forEach(function(name)
{
	OPTIONS_OLDKEY_MAP['I18NhandlerTpl_'+name] = 'I18NHandlerTPL_'+name;
});


module.exports = function(options)
{
	_.each(OPTIONS_OLDKEY_MAP, function(newKey, oldKey)
	{
		if (oldKey in options && !(newKey in options))
		{
			options[newKey] = options[oldKey];
			deprecate('use `'+newKey+'` instead of `'+oldKey+'`');
		}
	});

	if (!('I18NHandlerTPL_GetLanguageCode' in options))
	{
		['I18NhandlerTpl_GetGlobalCode', 'I18NhandlerTpl:GetGlobalCode'].some(function(name)
		{
			if (name in options)
			{
				options.I18NHandlerTPL_GetLanguageCode = GetLanguageCodeDepd.toString()
					.replace(/\$GetLanguageCode/, ''+options[name]);

				deprecate('use `I18NHandlerTPL_GetLanguageCode` instead of `'+name+'`');
				return true;
			}
		});

		// 前提是没有定义GetLanguageCode
		// 如果有定义，则不要使用此方法，会导致缺少cookie变量
		if (!('I18NHandlerTPL_LanguageVars' in options))
		{
			['I18NhandlerTpl_LanguageVarName', 'I18NhandlerTpl:LanguageVarName'].some(function(name)
			{
				if (name in options)
				{
					options['I18NHandlerTPL_LanguageVars'] =
					{
						name: options[name]
					};

					deprecate('use `I18NHandlerTPL_LanguageVars` instead of `'+name+'`');
					return true;
				}
			});
		}
	}

	if (!('minTranslateFuncCode' in options) && ('isMinFuncTranslateCode' in options))
	{
		options.minTranslateFuncCode = options.isMinFuncTranslateCode ? 'all' : 'onlyFunc';
		deprecate('use `minTranslateFuncCode='+options.minTranslateFuncCode
			+'` instead of `isMinFuncTranslateCode='+options.isMinFuncTranslateCode+'`');
	}
}

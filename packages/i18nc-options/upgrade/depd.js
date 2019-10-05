'use strict';

var _					= require('lodash');
var debug				= require('debug')('i18nc-options:depd');
var deprecate			= require('depd')('i18nc-options');
var i18ncDB				= require('i18nc-db');
var keyUtils			= require('../lib/key_utils.js');
var VARS				= require('../lib/vars');
var KeyObj				= keyUtils.KeyObj;
var GetLanguageCodeDepd	= require('./tpl/depd_getlanguagecode_handler').toString();


var rename_1to1 = (function()
{
	var checkMap = {};
	_.each(VARS.OLD_RENAME_OPTIONS, function(newKey, oldKey)
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

			case 'codeModifiedArea.I18NHandler':
				debug('has codeModifiedArea.I18NHandler set');
				break;
		}

		deprecate('use `'+newKey+'` instead of `'+oldKey+'`');
		return val;
	}

	return function(myKeys)
	{
		_.each(checkMap, function(oldKeys, newKey)
		{
			// options已经定义了最新的key
			if (myKeys.exists(newKey)) return;

			_.some(oldKeys, function(oldKey)
			{
				// 判断老的key，有没有可能存在
				if (myKeys.exists(oldKey))
				{
					var val = repalceKeyValHandler(newKey, oldKey, myKeys.getVal(oldKey));
					myKeys.setVal(newKey, val);
					return true;
				}
			});
		});
	};
})();



function rename_1toN(myKeys)
{
	_.each(VARS.OLD_VALUE_OPTIONS, function(targetArr, oldKey)
	{
		// 老的key是否定义，值是否满足
		var oldKeyInfo = keyUtils.str2keyVal(oldKey);
		if (!myKeys.exists(oldKeyInfo.key)
			|| myKeys.getVal(oldKeyInfo.key) !== oldKeyInfo.value)
		{
			return;
		}

		// 判断新的是否已经定义
		var ret = targetArr.some(function(newKey)
		{
			return myKeys.exists(keyUtils.str2keyVal(newKey).key);
		});

		if (ret) return;

		// 值转换
		targetArr.forEach(function(newKey)
		{
			var info = keyUtils.str2keyVal(newKey);
			myKeys.setVal(info.key, info.value);
		});

		deprecate('use `'+targetArr.join(';')+'` instead of `'+oldKey+'`');
	});
}


function rmkeys(myKeys)
{
	_.each(VARS.RM_OPTIONS, function(defaultVal, key)
	{
		switch(key)
		{
			case 'I18NHandler.data.defaultLanguage':
				if (myKeys.exists(key))
				{
					deprecate('`'+key+'` will be removed');
				}
				else if (myKeys.exists('defaultTranslateLanguage'))
				{
					deprecate('`defaultTranslateLanguage` will be removed');
					myKeys.setVal(key, myKeys.getVal('defaultTranslateLanguage'));
				}
				else
				{
					myKeys.setVal(key, defaultVal);
				}
				break;

			default:
				if (myKeys.exists(key))
					deprecate('`'+key+'` will be removed');
				else
					myKeys.setVal(key, defaultVal);
		}
	});
}


exports.before = function(options)
{
	var myKeys = new KeyObj(options);
	rename_1toN(myKeys);
	rename_1to1(myKeys);

	var dbTranslateWords = i18ncDB.update(options.dbTranslateWords);
	if (dbTranslateWords)
	{
		deprecate('dbTranslateWords v2 is support')
		options.dbTranslateWords = dbTranslateWords;
	}
}

exports.after = function(result)
{
	var resultVals = new KeyObj(result);
	rmkeys(resultVals);
};

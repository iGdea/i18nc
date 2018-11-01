'use strict';

var _				= require('lodash');
var extend			= require('extend');
var debug			= require('debug')('i18nc-core:options');
var depdOptions		= require('../upgrade/depd_options');
var valUtils		= require('./options_vals.js');
var OptionsVals		= valUtils.OptionsVals;
var ObjectToString	= ({}).toString;

var LINK_VALUES = exports.LINK_VALUES =
{
	'I18NHandler.style.minFuncJSON=true':
		'I18NHandler.style.comment4nowords=false',

	'I18NHandler.style.codeStyle=fullHandler':
		'I18NHandler.style.fullHandler.keepThisStyle=true',

	'I18NHandler.style.codeStyle=proxyGlobalHandler':
		'I18NHandler.style.proxyGlobalHandler.keepThisStyle=true',

	'I18NHandler.style.fullHandler.keepThisStyle=false':
		'I18NHandler.style.fullHandler.autoConvert=false',

	'I18NHandler.style.proxyGlobalHandler.keepThisStyle=false':
		'I18NHandler.style.proxyGlobalHandler.autoConvert=false',
};


exports.extend = function(defaults, originalOptions)
{
	defaults = extend(true, {}, defaults);
	var options = extend(true, {}, originalOptions);
	if (options.depdEnable !== false) depdOptions.before(options);
	var result = _extendDefault(defaults, options, '');
	depdOptions.after(result);

	// for emitter
	// 回调的时候，可能会带有额外的参数，保留这份
	result.originalOptions = originalOptions;

	var cutwordReg = result.cutwordReg;
	// 必须lastIndex必须重制为0，且处于global状态
	if (cutwordReg instanceof RegExp
		&& (cutwordReg.lastIndex !== 0 || !cutwordReg.global))
	{
		throw new Error('Invalid cutwordReg');
	}

	_fixOptionsVal(result);

	return result;
}

function _fixOptionsVal(options)
{
	var optionsVals = new OptionsVals(options);

	_.each(LINK_VALUES, function(targetKey, readKey)
	{
		var readInfo = valUtils.str2keyVal(readKey);

		if (optionsVals.exists(readInfo.key)
			&& optionsVals.getVal(readInfo.key) === readInfo.value)
		{
			var targetInfo = valUtils.str2keyVal(targetKey);
			if (optionsVals.getVal(targetInfo.key) !== targetInfo.value)
			{
				optionsVals.setVal(targetInfo.key, targetInfo.value);
				debug('when %s, then %s', readKey, targetKey);
			}
		}
	});
}



exports.freeze = function(obj)
{
	if (Object.freeze)
	{
		_.each(obj, function(val, key)
		{
			if (key != 'pluginEnabled' && key != 'pluginSettings')
			{
				deepFreeze(val);
			}
		});

		Object.freeze(obj);
	}
}



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

function _arr2jsonOnly(defaults, arr)
{
	var result = {};
	arr.forEach(function(name)
	{
		if (typeof defaults[name] == 'boolean')
			result[name] = true;
		else
			debug('ignore key <%s>, which are not defined in defaults.', name);
	});
	return result;
}

function _arr2jsonMore(arr, defaultVal)
{
	var result = _.extend({}, defaultVal);
	arr.forEach(function(name)
	{
		result[name] = true;
	});
	return result;
}


function _extendDefault(defaults, object, parentKey)
{
	if (!object) return defaults;

	var result = {};
	_.each(defaults, function(defaultVal, key)
	{
		if (object.hasOwnProperty(key))
		{
			var newVal = object[key];
			var defaultType = typeof defaultVal;

			if (newVal === false)
			{
				if (parentKey == '' && key == 'I18NHandler')
				{
					result[key] =
					{
						insert: {enable: false},
						upgrade: {enable: false},
					};

					return;
				}
				else if (parentKey == '.I18NHandler'
					&& (key == 'insert' || key == 'upgrade'))
				{
					result[key] = {enable: false};
					return;
				}
			}


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
						if (parentKey == '')
						{
							if (key == 'ignoreScanHandlerNames')
							{
								result[key] = _arr2jsonMore(newVal, defaultVal);
								return;
							}
							else if (key == 'pluginEnabled' || key == 'codeModifyItems')
							{
								result[key] = _arr2jsonOnly(defaultVal, newVal);
								return;
							}
						}

						if (Array.isArray(defaultVal))
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
						result[key] = _extendDefault(defaultVal, newVal, parentKey+'.'+key);
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

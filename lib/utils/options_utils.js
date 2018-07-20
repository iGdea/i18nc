'use strict';

var _ = require('lodash');
var extend = require('extend');
var debug = require('debug')('i18nc-core:options');
var depdOptions = require('../upgrade/depd_options');
var ObjectToString = ({}).toString;


exports.extend = function(defaults, options)
{
	if (!options) return _.extend({}, defaults);
	if (options.depdEnable !== false) depdOptions(options);
	var result = _extendDefault(defaults, options);

	// 直接设置为false
	// 避免生成无用的key
	if (result.I18NHandler.style.minFuncJSON)
	{
		if (result.I18NHandler.style === defaults.I18NHandler.style)
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

exports.FeatureEnableOnly = FeatureEnableOnly;

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

exports.FeatureEnableMore = FeatureEnableMore;

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

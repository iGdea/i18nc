'use strict';

var _ = require('lodash');
var debug = require('debug')('i18nc-core:options_vals');


exports.OptionsVals = OptionsVals;

var KEY_ARRS = {};
function getKeys(key)
{
	return KEY_ARRS[key] || (KEY_ARRS[key] = key.split('.'));
}

function OptionsVals(options)
{
	this.options = options;
	this._keyCache = {};
}

_.extend(OptionsVals.prototype,
{
	exists: function(key)
	{
		var keyCache  = this._keyCache;
		if (key in keyCache) return true;

		this.getVal(key);

		return key in keyCache;
	},
	getVal: function(key)
	{
		var keyCache  = this._keyCache;
		if (key in keyCache) return keyCache[key];

		var key2 = '';
		var prevVal = this.options;
		var items = getKeys(key);
		var exists = !_.some(items, function(name, index)
		{
			if (!prevVal) return true;

			if (key2) keyCache[key2] = prevVal;
			key2 += index === 0 ? name : '.'+name;
			if (name in prevVal)
			{
				prevVal = prevVal[name];
			}
			else if (index == items.length - 1 && Array.isArray(prevVal))
			{
				debug('val is exists by array mode, key:%s', key);
				prevVal = prevVal.indexOf(name) != -1;
			}
			else
			{
				return true;
			}
		});

		if (exists)
		{
			keyCache[key] = prevVal;
			return prevVal;
		}
	},
	setVal: function(key, val)
	{
		var keyCache = this._keyCache;
		keyCache[key] = val;
		var items = getKeys(key);
		var len = items.length;
		var prevVal;

		if (len < 3 || !(prevVal = keyCache[items.slice(0, -1).join('.')]))
		{
			prevVal = this.options;
			for(var tmp, name, i = 0, key2 = '', t = len -1; i < t; i++)
			{
				name = items[i];
				key2 += i === 0 ? name : '.'+name;
				tmp = prevVal[name];
				if (!tmp || typeof tmp != 'object')
					prevVal = prevVal[name] = {};
				else
					prevVal = tmp;

				keyCache[key2] = prevVal;
			}
		}

		var name = items[len -1];
		if (Array.isArray(prevVal) && val === true)
		{
			prevVal.push(name);
			debug('set val in array mode, key:%s', key);
		}
		else
		{
			prevVal[name] = val;
		}
	}
});


var STR2KEYVAL = {};
exports.str2keyVal = str2keyVal;
function str2keyVal(key)
{
	var ret = STR2KEYVAL[key];

	if (!ret)
	{
		var arr = key.split('=');
		var val = arr.pop();

		if (val == 'true') val = true;
		else if (val == 'false') val = false;

		ret = STR2KEYVAL[key] =
		{
			key: arr.join('='),
			value: val
		};
	}

	return ret;
}

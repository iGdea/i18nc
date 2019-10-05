'use strict';

var utils = require('./lib/utils');
var globalDefaults = require('./lib/defaults');
exports.defaults = globalDefaults;
exports.VARS = require('./lib/vars');

utils.freeze(globalDefaults);

exports.init = function(obj)
{
	return utils.extend(globalDefaults, obj);
}

exports.extend = function(defaults, obj)
{
	if (arguments.length < 2)
	{
		obj = defaults;
		defaults = globalDefaults;
	}

	return utils.extend(defaults, obj);
};

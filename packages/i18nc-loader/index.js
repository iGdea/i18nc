'use strict';

var debug = require('debug')('i18nc-loader');
var i18nc = require('i18nc');
var loaderUtils = require('loader-utils');

module.exports = function(source)
{
	var options = loaderUtils.getOptions(this) || {};
	var callback = this.callback;
	var result;

	debug('request:%s', this.request);

	// if (this.cacheable) this.cacheable();

	try {
		result = i18nc(source, options);
	}
	catch (err)
	{
		callback(err);
		return;
	}

	callback(null, result.code);
};

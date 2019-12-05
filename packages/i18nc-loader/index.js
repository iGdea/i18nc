'use strict';

var debug = require('debug')('i18nc-loader');
var i18nc = require('i18nc');
var loaderUtils = require('loader-utils');
var extend = require('extend');

module.exports = function(source)
{
	var options = loaderUtils.getOptions(this) || {};
	var dbTranslateWords = options.dbTranslateWords;

	debug('request:%s', this.request);

	// if (this.cacheable) this.cacheable();

	var poFilesInputDir = options.poFilesInputDir;
	var dbTranslateWordsPromise;
	if (poFilesInputDir)
	{
		dbTranslateWordsPromise = i18nc.util.file.loadPOFiles(poFilesInputDir)
			.then(function(data)
			{
				return extend(true, {}, data, dbTranslateWords);
			});
	}
	else
	{
		dbTranslateWordsPromise = Promise.resolve(dbTranslateWords);
	}

	return dbTranslateWordsPromise.then(function(dbTranslateWords)
		{
			return i18nc(source, extend({}, options, { dbTranslateWords: dbTranslateWords })).code;
		});

};

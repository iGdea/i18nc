'use strict';

const debug = require('debug')('i18nc-loader');
const i18nc = require('i18nc');
const loaderUtils = require('loader-utils');
const extend = require('extend');

module.exports = async function(source) {
	const options = loaderUtils.getOptions(this) || {};
	let dbTranslateWords = options.dbTranslateWords;

	debug('request:%s', this.request);

	// if (this.cacheable) this.cacheable();

	const poFilesInputDir = options.poFilesInputDir;
	if (poFilesInputDir) {
		dbTranslateWords = await i18nc.util.file.loadPOFiles(poFilesInputDir)
			.then(function(data) {
				return extend(true, {}, data, dbTranslateWords);
			});
	}

	return i18nc(
		source,
		extend({}, options, { dbTranslateWords: dbTranslateWords })
	).code;
};

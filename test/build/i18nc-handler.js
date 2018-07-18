'use strict';

var fs = require('fs');
var i18ncTpl = require('../../lib/i18n_func/render');
var optionsUtils = require('../../lib/options');
var DEF = require('../../lib/def');
var options = optionsUtils.extend();
var version = DEF.I18NFunctionVersion+'.'+DEF.I18NFunctionSubVersion.SIMPLE;

var content = i18ncTpl.renderSimple(
	{
		FILE_KEY: options.I18NHandler.data.defaultFileKey,
		FUNCTION_VERSION: version,
		handlerName: options.I18NHandlerName,
	});

fs.writeFileSync(__dirname+'/../../dist/i18nc-handler.js', content);

'use strict';

var fs = require('fs');
var i18ncTpl = require('../../lib/i18n_func/render');
var optionsUtils = require('../../lib/options');
var DEF = require('../../lib/def');
var wrapCode = require('./wrap-code.tpl.js').toString();
var options = optionsUtils.extend();

var code = i18ncTpl.renderSimple(
	{
		FILE_KEY: options.I18NHandler.data.defaultFileKey,
		FUNCTION_VERSION: DEF.I18NFunctionVersion,
		handlerName: options.I18NHandlerName,
	});

var content =
[
	';('+wrapCode+')',
	'(function(r, ctx)',
	'{',
		'\t'+code.replace(/\n\r?/g, '\n\t'),
		'',
		'\tctx.'+options.I18NHandlerName+' = '+options.I18NHandlerName+';',
	'});',
	''
]
.join('\n');

fs.writeFileSync(__dirname+'/../../dist/i18nc-handler.js', content);

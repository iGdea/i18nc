'use strict';

var fs = require('fs');
var toRender = require('./to_render');
var codeTpl = toRender(require('../../src/i18nc_handler'));
var optionsUtils = require('../../lib/options');
var options = optionsUtils.extend();

var code = codeTpl(
	{
		handlerName: options.I18NHandlerName,
	});


var content = toRender.wrapCode({code: code, handlerName: options.I18NHandlerName});
fs.writeFileSync(__dirname+'/../../dist/i18nc_handler.js', content);

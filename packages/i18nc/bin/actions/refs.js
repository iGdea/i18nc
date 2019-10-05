'use strict';

var debug     = require('debug')('i18nc:refs');
var i18ncUtil = require('../../util/index');
var cliPrinter = require('../../util/cli_printer');

module.exports = function(str)
{
	str = str.replace(/^\D*/, '');
	debug('deal str: %s', str);

	var info = i18ncUtil.refs.parse(str);
	var output = cliPrinter.printRefs(info);
	console.log(output);
};

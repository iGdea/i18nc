'use strict';

const debug = require('debug')('i18nc:refs');
const i18ncUtil = require('../../util/index');
const cliPrinter = require('../../util/cli_printer');

module.exports = function(str) {
	str = str.replace(/^\D*/, '');
	debug('deal str: %s', str);

	const info = i18ncUtil.refs.parse(str);
	const output = cliPrinter.printRefs(info);
	console.log(output);
};

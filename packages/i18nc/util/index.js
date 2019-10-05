'use strict';

var _ = require('lodash');

exports.refs = require('i18nc-po/lib/refs_utils');
exports.cli = require('./cli_printer');
exports.opt =
{
	tpl: require('./opt_tpl')
};
exports.file = _.extend({}, require('./load_po_files'),
{
	mulitResult2POFiles: require('./fileresult').mulitResult2POFiles
});

exports.getlans = require('./getlans');

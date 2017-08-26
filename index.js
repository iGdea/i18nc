var esprima			= require('esprima');
var optionsUtils	= require('./lib/options');

exports = module.exports = require('./lib/main');
exports.parse = function(code)
{
	return esprima.parse(code, optionsUtils.esprimaOptions);
};

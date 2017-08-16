var expect				= require('expect.js');
var esprima				= require('esprima');
var i18nFunctionUtils	= require('../lib/i18n_function_utils');

describe('#i18n_function_utils', function()
{
	it('#dealTranslateDataJSON', function()
	{
		var astData = require('./files/translate_data_json.json');
		var result = i18nFunctionUtils._dealTranslateDataJSON(astData);
		console.log('\n\n\n', result);
		expect(result).to.eql(require('./files/translate_data_json_output.json'));
	});

	it('#parse', function()
	{
		var code = require('./files/i18n_handler_example').toString();
		var ast = esprima.parse(code);
		var result = i18nFunctionUtils.parse(ast);

		expect(result).to.eql(require('./files/i18n_handler_example_output.json'));
	});
});

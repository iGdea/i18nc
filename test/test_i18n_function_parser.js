var expect				= require('expect.js');
var esprima				= require('esprima');
var i18nFunctionParser	= require('../lib/i18n_function_parser');

describe('#i18n_function_parser', function()
{
	it('#dealTranslateDataJSON', function()
	{
		var astData = require('./files/translate_data_json.json');
		var result = i18nFunctionParser._dealTranslateDataJSON(astData);
		console.log('\n\n\n', result);
		expect(result).to.eql(require('./files/translate_data_json_output.json'));
	});

	it('#parse', function()
	{
		var code = require('./files/i18n_handler_example').toString();
		var ast = esprima.parse(code);
		var result = i18nFunctionParser.parse(ast);

		expect(result).to.eql(require('./files/i18n_handler_example_output.json'));
	});
});

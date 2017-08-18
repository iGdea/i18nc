var fs					= require('fs');
var expect				= require('expect.js');
var esprima				= require('esprima');
var i18nFunctionParser	= require('../lib/i18n_function_parser');

describe('#i18n_function_parser', function()
{
	it('#translateDataAst2json', function()
	{
		var astData = require('./files/translate_data_ast.json');
		var result = i18nFunctionParser._translateDataAst2json(astData);
		expect(result).to.eql(require('./files/translate_data.json'));
	});

	it('#parse', function()
	{
		var code = require('./files/i18n_handler_example').toString();
		var ast = esprima.parse(code);
		var result = i18nFunctionParser.parse(ast);

		// fs.writeFileSync(__dirname+'/files/i18n_handler_example_output.json', JSON.stringify(result, null, '\t'));

		expect(result).to.eql(require('./files/i18n_handler_example_output.json'));
	});
});

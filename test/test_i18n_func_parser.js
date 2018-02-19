var expect				= require('expect.js');
var esprima				= require('esprima');
var i18nParser			= require('../lib/i18n_func/parser');
var requireAfterWrite	= require('./auto_test_utils').requireAfterWrite();

describe('#i18n_func_parser', function()
{
	it('#translateSubtreeAst2json', function()
	{
		var astData = require('./files/translate_data_ast.json');
		var result = i18nParser._translateSubtreeAst2json(astData);

		var outputJSON = requireAfterWrite('translate_data.json', result);

		expect(result).to.eql(outputJSON);
	});

	it('#parse', function()
	{
		var code = require('./files/i18n_handler_example').toString();
		var ast = esprima.parse(code);
		var result = i18nParser.parse(ast.body[0]);

		var outputJSON = requireAfterWrite('i18n_handler_example_output.json', result);

		expect(result).to.eql(outputJSON);
	});
});

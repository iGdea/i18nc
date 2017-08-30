var expect				= require('expect.js');
var esprima				= require('esprima');
var autoWriteFile		= require('./files/auto_write_file');
var i18nFunctionParser	= require('../lib/i18n_function_parser');

describe('#i18n_function_parser', function()
{
	describe('#translateSubtreeAst2json', function()
	{
		it('#normal', function()
		{
			var astData = require('./files/translate_data_ast.json');
			var result = i18nFunctionParser._translateSubtreeAst2json(astData);

			autoWriteFile('translate_data.json', JSON.stringify(result, null, '\t'));

			expect(result).to.eql(require('./files/translate_data.json'));
		});

		it('#empty head', function()
		{
			var astData = require('./files/translate_data_ast_empty_head.json');
			var result = i18nFunctionParser._translateSubtreeAst2json(astData);

			autoWriteFile('translate_data_empty_head.json', JSON.stringify(result, null, '\t'));

			expect(result).to.eql(require('./files/translate_data_empty_head.json'));
		});
	});

	it('#parse', function()
	{
		var code = require('./files/i18n_handler_example').toString();
		var ast = esprima.parse(code);
		var result = i18nFunctionParser.parse(ast);

		autoWriteFile('i18n_handler_example_output.json', result);

		expect(result).to.eql(require('./files/i18n_handler_example_output.json'));
	});
});

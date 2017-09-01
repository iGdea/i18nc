var expect				= require('expect.js');
var esprima				= require('esprima');
var autoWriteFile		= require('./files/auto_write_file');
var i18nFunctionParser	= require('../lib/i18n_function_parser');

describe('#i18n_function_parser', function()
{
	describe('#translateLogicalValAst2arr', function()
	{
		function run(code)
		{
			var ast = esprima.parse(code).body[0].expression;
			return i18nFunctionParser._translateLogicalValAst2arrWidthClear(ast);
		}

		it('#normal', function()
		{
			expect(run('1 || 2 || 3 || 4')).to.eql([4, 3, 2, 1]);
		});

		it('#no and', function()
		{
			expect(run).withArgs('1 || 2 && 3 || 4').to.throwError('RANSLATE_JSON DATA OPERATOR IS NOT `OR`');
		});

		it('#array empty', function()
		{
			expect(run('[] || 0 || 0')).to.eql(['', 0, 0]);
		});

		it('#empty string', function()
		{
			expect(run('"" || 1 || 0')).to.eql([0, 1]);
		});

		it('#empty 10000', function()
		{
			expect(run('1 || 0 || 0 || 0')).to.eql([0, 0, 0, 1]);
		});

		it('#empty 0001', function()
		{
			expect(run('0 || 0 || 0 || 1')).to.eql([1]);
		});

		it('#empty 0(00)1', function()
		{
			expect(run('0 || (0 || 0) || 1')).to.eql([1]);
		});

		it('#empty 1001', function()
		{
			expect(run('1 || 0 || 0 || 1')).to.eql([1, 0, 0, 1]);
		});

		it('#empty 1(00)1', function()
		{
			expect(run('1 || (0 || 0) || 1')).to.eql([1, 0, 0, 1]);
		});

		it('#empty 10(01)', function()
		{
			expect(run('1 || 0 || (0 || 1)')).to.eql([1, 0, 0, 1]);
		});
	});


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

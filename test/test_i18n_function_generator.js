var debug					= require('debug')('i18nc:test_i18n_function_generator');
var expect					= require('expect.js');
var escodegen				= require('escodegen');
var optionsUtils			= require('../lib/options');
var i18nFunctionGenerator	= require('../lib/i18n_function_generator');

describe('#i18n_function_generator', function()
{
	it('#wordmap2ast', function()
	{
		var astData = require('./files/translate_data.json');
		var resultAst = i18nFunctionGenerator._wordmap2ast(astData);
		debug('wordmap2ast resultAst:%o', resultAst);
		var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);

		var otherAst = require('./files/translate_data_ast.json');
		otherAst.properties = otherAst.properties.sort(function(a, b)
			{
				return a.key.value > b.key.value ? 1 : -1;
			});
		var otherCode = escodegen.generate(otherAst, optionsUtils.escodegenOptions);

		expect(resultCode).to.be(otherCode);
	});
});

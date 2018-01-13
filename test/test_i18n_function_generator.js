var fs						= require('fs');
var debug					= require('debug')('i18nc-core:test_i18n_function_generator');
var expect					= require('expect.js');
var escodegen				= require('escodegen');
var optionsUtils			= require('../lib/options');
var autoTestUtils			= require('./auto_test_utils');
var requireAfterWrite		= autoTestUtils.requireAfterWrite();
var i18nFunctionGenerator	= require('../lib/i18n_function_generator');

describe('#i18n_function_generator', function()
{
	it('#wordmap2ast', function()
	{
		var astData = require('./files/translate_data.json');
		var resultAst = i18nFunctionGenerator._wordmap2ast(astData);
		var otherAst = requireAfterWrite('translate_data_ast.json', resultAst);
		debug('wordmap2ast resultAst:%o', resultAst);
		var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);

		otherAst.properties = otherAst.properties.sort(function(a, b)
			{
				return a.key.value > b.key.value ? 1 : -1;
			});
		var otherCode = escodegen.generate(otherAst, optionsUtils.escodegenOptions);

		expect(autoTestUtils.code2arr(resultCode)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	it('#mergeTranslateData', function()
	{
		var args = require('./files/merge_translate_data');
		var result = i18nFunctionGenerator._mergeTranslateData(args);

		var outputJSON = requireAfterWrite('merge_translate_data_json.json', result);

		expect(result).to.eql(outputJSON);
	});

	it('#to_TRANSLATE_DATA_fromat', function()
	{
		var args = require('./files/merge_translate_data_json.json');
		var result = i18nFunctionGenerator._to_TRANSLATE_DATA_fromat(args);

		var outputJSON = requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(outputJSON);
	});


	it('#getTranslateJSON', function()
	{
		var args = require('./files/merge_translate_data.js');
		var result = i18nFunctionGenerator.getTranslateJSON(args);

		expect(result).to.eql(require('./files/merge_translate_data_output.json'));
	});


	it('#genTranslateJSONCode', function()
	{
		var data = require('./files/merge_translate_data_json.json');
		var result = i18nFunctionGenerator._to_TRANSLATE_DATA_fromat(data);

		var outputJSON = requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(outputJSON);
	});


	it('#translateJSON2ast', function()
	{
		var data = require('./files/merge_translate_data_output.json');
		var resultAst = i18nFunctionGenerator._translateJSON2ast(data);
		var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);

		resultCode = 'module.exports = '+resultCode;

		var otherCode = requireAfterWrite('merge_translate_data_output.js', resultCode, {readMode: 'string'});

		expect(autoTestUtils.code2arr(resultCode)).to.eql(autoTestUtils.code2arr(otherCode));
	});
});

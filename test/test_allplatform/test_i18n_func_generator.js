'use strict';

var expect				= require('expect.js');
var escodegen			= require('escodegen');
var autoTestUtils		= require('../auto_test_utils');
var optionsUtils		= require('../../lib/options');
var i18nGenerator		= require('../../lib/i18n_func/generator');
var i18nGeneratorTest	= i18nGenerator._test;
var requireAfterWrite	= autoTestUtils.requireAfterWrite('i18n_func_generator');

describe('#i18n_func_generator', function()
{
	it('#to_TRANSLATE_DATA_fromat', function()
	{
		var args = require('../files/output/merge_translate_data/merge_translate_data.json');
		var result = i18nGeneratorTest._to_TRANSLATE_DATA_fromat(args);

		var outputJSON = requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(outputJSON);
	});


	it('#getTranslateJSON', function()
	{
		var args = require('../files/merge_translate_data');
		var result = i18nGenerator.getTranslateJSON(args);

		var outputJSON = requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(outputJSON);
	});


	it('#genTranslateJSONCode', function()
	{
		var data = require('../files/output/merge_translate_data/merge_translate_data.json');
		var result = i18nGeneratorTest._to_TRANSLATE_DATA_fromat(data);

		var outputJSON = requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(outputJSON);
	});


	it('#translateJSON2ast', function()
	{
		var data = require('../files/output/i18n_func_generator/merge_translate_data_output.json');
		var resultAst = i18nGeneratorTest._translateJSON2ast(data);
		var resultCode = 'var json = '+escodegen.generate(resultAst, optionsUtils.escodegenOptions);

		var otherCode = requireAfterWrite('merge_translate_data_output.js', resultCode);

		expect(autoTestUtils.code2arr(resultCode)).to.eql(autoTestUtils.code2arr(otherCode));
	});
});

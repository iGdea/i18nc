var fs						= require('fs');
var debug					= require('debug')('i18nc:test_i18n_function_generator');
var expect					= require('expect.js');
var escodegen				= require('escodegen');
var optionsUtils			= require('../lib/options');
var requireAfterWrite		= require('./auto_test_utils').requireAfterWrite;
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

		expect(code2arr(resultCode)).to.eql(code2arr(otherCode));
	});


	it('#mergeTranslateData', function()
	{
		var args = require('./files/merge_translate_data');
		var result = i18nFunctionGenerator._mergeTranslateData(args);

		requireAfterWrite('merge_translate_data_json.json', result);

		expect(result).to.eql(require('./files/merge_translate_data_json.json'));
	});

	it('#to_TRANSLATE_DATA_fromat', function()
	{
		var args = require('./files/merge_translate_data_json.json');
		var result = i18nFunctionGenerator._to_TRANSLATE_DATA_fromat(args);

		requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(require('./files/merge_translate_data_output.json'));
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

		requireAfterWrite('merge_translate_data_output.json', result);

		expect(result).to.eql(require('./files/merge_translate_data_output.json'));
	});


	it('#translateJSON2ast', function()
	{
		var data = require('./files/merge_translate_data_output.json');
		var resultAst = i18nFunctionGenerator._translateJSON2ast(data);
		var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);

		resultCode = 'module.exports = '+resultCode;

		requireAfterWrite('merge_translate_data_output.js', resultCode);

		var otherCode = fs.readFileSync(__dirname+'/files/merge_translate_data_output.js').toString();

		expect(code2arr(resultCode)).to.eql(code2arr(otherCode));
	});
});


function code2arr(code)
{
	return code.split('\n')
		.map(function(val)
		{
			return val.trim();
		})
		.filter(function(val)
		{
			return val;
		});
}

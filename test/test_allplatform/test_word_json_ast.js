'use strict';

var expect				= require('expect.js');
var escodegen			= require('escodegen');
var optionsUtils		= require('../../lib/options');
var i18nParser			= require('../../lib/i18n_func/parser');
var i18nGenerator		= require('../../lib/i18n_func/generator');
var i18nGeneratorTest	= i18nGenerator._test;
var i18nParserTest		= i18nParser._test;


describe('#word_json_ast', function()
{
	it('#base', function()
	{
		var astData =
		{
			'word_1': '文字_1',
			'word_3': '文字_3',
			'word_2': '文字_2',
			'word_empty1': [],
			'word_empty2': '',
		};

		var resultAst = i18nGeneratorTest._wordJson2ast(astData);
		var astJson = JSON.parse(escodegen.generate(resultAst, {format: {quotes: 'double'}}));
		expect(astJson)
			.to.eql({word_1: '文字_1', word_2: '文字_2', word_3: '文字_3', word_empty1: [], word_empty2: []});
		expect(Object.keys(astJson))
			.to.eql(['word_1', 'word_2', 'word_3', 'word_empty1', 'word_empty2']);

		var resultJson = i18nParserTest._wordAst2json(resultAst);
		expect(resultJson)
			.to.eql({word_1: '文字_1', word_2: '文字_2', word_3: '文字_3', word_empty1: '', word_empty2: ''});
		expect(Object.keys(resultJson))
			.to.eql(['word_1', 'word_2', 'word_3', 'word_empty1', 'word_empty2']);
	});

	describe('#wordJson2as', function()
	{
		describe('#comments', function()
		{
			it('#empty', function()
			{
				var astData =
				{
					'word_1': null,
					'word_2': null,
					'word_3': null,
				};
				function code()
				{
					var d =
					{
						// 'word_1':
						// 'word_2':
						// 'word_3':
						'<e.g.> translate word': null
					}
				}
				var resultAst = i18nGeneratorTest._wordJson2ast(astData);
				var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1));
			});

			it('#first', function()
			{
				var astData =
				{
					'word_1': null,
					'word_2': null,
					'word_3': 'word_3',
				};
				function code()
				{
					var d =
					{
						// 'word_1':
						// 'word_2':
						'word_3': 'word_3'
					}
				}
				var resultAst = i18nGeneratorTest._wordJson2ast(astData);
				var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1));
			});

			it('#middle', function()
			{
				var astData =
				{
					'word_1': null,
					'word_2': 'word_2',
					'word_3': null,
				};
				function code()
				{
					var d =
					{
						// 'word_1':
						// 'word_3':
						'word_2': 'word_2'
					}
				}
				var resultAst = i18nGeneratorTest._wordJson2ast(astData);
				var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1));
			});

			it('#last', function()
			{
				var astData =
				{
					'word_1': null,
					'word_2': null,
					'word_3': 'word_3',
				};
				function code()
				{
					var d =
					{
						// 'word_1':
						// 'word_2':
						'word_3': 'word_3'
					}
				}
				var resultAst = i18nGeneratorTest._wordJson2ast(astData);
				var resultCode = escodegen.generate(resultAst, optionsUtils.escodegenOptions);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1));
			});
		});
	});
});

function code2arr(code)
{
	return code.split(/\n\r?\t*/)
		.filter(function(val)
		{
			return val;
		});
}

function func2codeArr(func)
{
	var code = func.toString().split('{');
	code.shift();
	code = code.join('{').split('}');
	code.pop();
	code = code.join('}');

	return code2arr(code);
}

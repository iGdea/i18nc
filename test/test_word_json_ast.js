var expect			= require('expect.js');
var escodegen		= require('escodegen');
var i18nParser		= require('../lib/i18n_func/parser');
var i18nGenerator	= require('../lib/i18n_func/generator');

describe('#word_json_ast', function()
{
	it('#base', function()
	{
		var astData =
		{
			"word_1": "文字_1",
			"word_3": "文字_3",
			"word_2": "文字_2",
			"word_empty1": [],
			"word_empty2": '',
		};

		var resultAst = i18nGenerator._wordJson2ast(astData);
		var astJson = JSON.parse(escodegen.generate(resultAst, {format: {quotes: 'double'}}));
		expect(astJson)
			.to.eql({word_1: '文字_1', word_2: '文字_2', word_3: '文字_3', word_empty1: [], word_empty2: []});
		expect(Object.keys(astJson))
			.to.eql(['word_1', 'word_2', 'word_3', 'word_empty1', 'word_empty2']);

		var resultJson = i18nParser._wordAst2json(resultAst);
		expect(resultJson)
			.to.eql({word_1: '文字_1', word_2: '文字_2', word_3: '文字_3', word_empty1: '', word_empty2: ''});
		expect(Object.keys(resultJson))
			.to.eql(['word_1', 'word_2', 'word_3', 'word_empty1', 'word_empty2']);
	});

	it('#comments', function()
	{
		console.log('@todo');
	});
});

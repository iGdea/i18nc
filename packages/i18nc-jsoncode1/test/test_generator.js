'use strict';

var expect				= require('expect.js');
var astUtil				= require('i18nc-ast').util;
var testReq				= require('i18nc-test-req');
var i18nGenerator		= require('../lib/generator');
var requireAfterWrite	= testReq('generator');
testReq.ROOT_PATH		= __dirname + '/output';

describe('#generator', function()
{
	it('#toTranslateJSON', function()
	{
		var data = require('./input.json');
		var result = i18nGenerator.toTranslateJSON(data);
		var outputJSON = requireAfterWrite('func_json.json', result);

		expect(result).to.eql(outputJSON);
	});


	it('#translateJSON2ast', function()
	{
		var data = require('./output/generator/func_json.json');
		var resultAst = i18nGenerator._translateJSON2ast(data);
		var resultCode = 'var json = '+astUtil.tocode(resultAst);

		var otherCode = requireAfterWrite('func_json.js', resultCode);

		expect(testReq.code2arr(resultCode)).to.eql(testReq.code2arr(otherCode));
	});


	describe('#wordJson2ast', function()
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
						'': null
					}
					console.log(d);
				}
				var resultAst = i18nGenerator._wordJson2ast(astData);
				var resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1, -1));
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
					console.log(d);
				}
				var resultAst = i18nGenerator._wordJson2ast(astData);
				var resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1, -1));
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
					console.log(d);
				}
				var resultAst = i18nGenerator._wordJson2ast(astData);
				var resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1, -1));
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
					console.log(d);
				}
				var resultAst = i18nGenerator._wordJson2ast(astData);
				var resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code).slice(1, -1));
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

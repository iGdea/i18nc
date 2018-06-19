'use strict';

var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoTestUtils		= require('./auto_test_utils');
var dbTranslateWords	= require('./example/translate_words_db');

describe('#example', function()
{
	describe('#func_code', function()
	{
		var requireAfterWrite	= autoTestUtils.requireAfterWrite('example');
		var exampleCode			= require('./example/func_code');

		it('#first', function()
		{
			var info = i18nc(exampleCode.toString(),
				{
					dbTranslateWords: dbTranslateWords
				});
			requireAfterWrite('func_code_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var json = info.squeeze().toJSON();
			delete json.code;
			requireAfterWrite('func_code_output_squeeze.json', json);

			var content = 'module.exports = '+info.code;
			var otherContent = requireAfterWrite('func_code_output.js', content, {readMode: 'string'});
			var translateWords = autoTestUtils.getCodeTranslateAllWords(info);
			var otherTranslateWords = requireAfterWrite('translate_words_code.json', translateWords);

			expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));
			expect(translateWords).to.eql(otherTranslateWords);
		});


		it('#retry', function()
		{
			var exampleCode_output = require('./example/func_code_output').toString();
			var info = i18nc(exampleCode_output,
				{
					dbTranslateWords: dbTranslateWords
				});
			requireAfterWrite('func_code_output2.json', autoTestUtils.JsonOfI18ncRet(info));
			var json = info.squeeze().toJSON();
			delete json.code;
			requireAfterWrite('func_code_output2_squeeze.json', json);

			var translateWords = autoTestUtils.getCodeTranslateAllWords(info);
			var otherTranslateWords = requireAfterWrite('translate_words_code.json', translateWords);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(exampleCode_output));
			expect(translateWords).to.eql(otherTranslateWords);
		});
	});


	it('#use require', function()
	{
		var requireAfterWrite	= autoTestUtils.requireAfterWrite('use_require');
		var i18nOptions =
		{
			dbTranslateWords: dbTranslateWords,
			loadTranslateJSON: function(emitData)
			{
				var ast = emitData.ast;

				if (ast.type == 'CallExpression'
					&& ast.callee
					&& ast.callee.name == 'require'
					&& ast.arguments
					&& ast.arguments[0]
					&& ast.arguments[0].type == 'Literal')
				{
					var file = __dirname+'/example/cases/use_require/'+ast.arguments[0].value;
					emitData.result = require(file);
					expect(emitData.result['en-US']).to.be.an('object');
				}
				else
				{
					expect().fail();
				}
			},
			newTranslateJSON: function(emitData)
			{
				var content = 'module.exports = '+emitData.result;
				var otherContent = requireAfterWrite('require_data.js', content, {readMode: 'string'});
				expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent.toString()));

				emitData.result = 'require("./require_data.js")';
			},
		};

		var exampleCode = require('./example/cases/use_require/func_code');
		var info = i18nc(exampleCode.toString(), i18nOptions);

		var otherCode = requireAfterWrite('func_code_output.js', 'module.exports = '+info.code);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});
});

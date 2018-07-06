'use strict';

var fs					= require('fs');
var path				= require('path');
var debug				= require('debug')('i18nc-core:test_example');
var expect				= require('expect.js');
var i18nc				= require('../../');
var autoTestUtils		= require('../auto_test_utils');
var dbTranslateWords	= require('../example/translate_words_db');

describe('#example', function()
{
	describe('#func_code', function()
	{
		var requireAfterWrite	= autoTestUtils.requireAfterWrite('example');
		var exampleCode			= require('../example/func_code');

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

			var otherContent = autoTestUtils.requireAfterWriteReal('example/func_code_output.js', info.code);
			var translateWords = autoTestUtils.getCodeTranslateAllWords(info);
			var otherTranslateWords = requireAfterWrite('translate_words_code.json', translateWords);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherContent));
			expect(translateWords).to.eql(otherTranslateWords);
		});


		it('#retry', function()
		{
			var exampleCode_output = require('../example/func_code_output').toString();
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
		var mainFile = '../example/use_require/func_code.js';
		var requireAfterWrite = autoTestUtils.requireAfterWrite('example/use_require');
		var i18nOptions =
		{
			mainFile: mainFile,
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
					expect(emitData.options.originalOptions.mainFile).to.be(mainFile);
					var file = '../example/use_require/'+ast.arguments[0].value;
					debug('loadTranslateJSON:%s', file);
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
				debug('newTranslateJSON:%s', emitData.result);
				expect(emitData.options.originalOptions.mainFile).to.be(mainFile);
				var content = 'function code(){\n// just fot test\nreturn '+emitData.result+';\n}';

				var otherContent = autoTestUtils.requireAfterWriteReal('example/use_require/require_data.js', content);
				expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));

				var otherJSON = autoTestUtils.requireAfterWriteReal('example/use_require/require_data.json', emitData.originalJSON);
				expect(emitData.originalJSON).to.be.eql(otherJSON);

				emitData.result = 'require("./require_data.json")';
			},
		};

		var exampleCode = require('../example/use_require/func_code.js');
		var info = i18nc(exampleCode.toString(), i18nOptions);
		var otherCode = autoTestUtils.requireAfterWriteReal('example/use_require/func_code_output.js', 'module.exports = '+info.code);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});
});

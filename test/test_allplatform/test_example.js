'use strict';

var debug				= require('debug')('i18nc-core:test_example');
var expect				= require('expect.js');
var i18nc				= require('../../');
var autoTestUtils		= require('../auto_test_utils');
var dbTranslateWords	= require('../files/casefile/translate_words_db');

describe('#example', function()
{
	describe('#func_code', function()
	{
		var requireAfterWrite	= autoTestUtils.requireAfterWrite('example');
		var exampleCode			= require('../files/casefile/func_code/func_code_example');

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

			var otherContent = requireAfterWrite('func_code_output.js', info.code);
			var translateWords = autoTestUtils.getCodeTranslateAllWords(info);
			var otherTranslateWords = requireAfterWrite('translate_words_code.json', translateWords);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherContent));
			expect(translateWords).to.eql(otherTranslateWords);
		});


		it('#retry', function()
		{
			var exampleCode_output = requireAfterWrite('func_code_output.js').toString();
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


	describe('#use require', function()
	{
		var requireAfterWrite = autoTestUtils.requireAfterWrite('example_use_require');

		it('#base', function()
		{
			var mainFile = './i18nc_options/file_path.js';
			var i18nOptions =
			{
				mainFile: mainFile,
				dbTranslateWords: dbTranslateWords,
				loadTranslateJSON: function(emitData)
				{
					var ast = emitData.original;

					if (ast.type == 'CallExpression'
						&& ast.callee
						&& ast.callee.name == 'require'
						&& ast.arguments
						&& ast.arguments[0]
						&& ast.arguments[0].type == 'Literal')
					{
						expect(emitData.options.originalOptions.mainFile).to.be(mainFile);
						var file = ast.arguments[0].value;
						debug('loadTranslateJSON:%s', file);
						expect(file).to.be('./require_data.json');

						emitData.result = autoTestUtils.isBuild() ? {} : requireAfterWrite(file);
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
					var content = 'var obj = ' + emitData.result;
					console.log('1111111', content);
					var otherContent = requireAfterWrite('require_data.js', content);
					expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));

					var otherJSON = requireAfterWrite('require_data.json', emitData.originalJSON);
					expect(emitData.originalJSON).to.be.eql(otherJSON);

					emitData.result = 'require("./require_data.json")';
				},
			};

			var exampleCode = require('../files/casefile/func_code/func_code_example_use_require');
			var info = i18nc(exampleCode.toString(), i18nOptions);
			var otherCode = requireAfterWrite('func_code_output.js', 'module.exports = '+info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});
});

'use strict';

const debug = require('debug')('i18nc-core:test_example');
const expect = require('expect.js');
const i18nc = require('../');
const autoTestUtils = require('./auto_test_utils');
const dbTranslateWords = require('./files/casefile/translate_words_db');

describe('#example', function() {
	describe('#func_code', function() {
		const requireAfterWrite = autoTestUtils.requireAfterWrite('example');
		const exampleCode = require('./files/casefile/func_code/func_code_example');

		it('#first', function() {
			const info = i18nc(exampleCode.toString(), {
				dbTranslateWords: dbTranslateWords
			});
			requireAfterWrite(
				'func_code_output.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			const json = info.squeeze().toJSON();
			delete json.code;
			requireAfterWrite('func_code_output_squeeze.json', json);

			const otherContent = requireAfterWrite(
				'func_code_output.js',
				info.code
			);
			const translateWords = autoTestUtils.getCodeTranslateAllWords(info);
			const otherTranslateWords = requireAfterWrite(
				'translate_words_code.json',
				translateWords
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherContent)
			);
			expect(translateWords).to.eql(otherTranslateWords);
		});

		it('#retry', function() {
			const exampleCode_output = requireAfterWrite(
				'func_code_output.js'
			).toString();
			const info = i18nc(exampleCode_output, {
				dbTranslateWords: dbTranslateWords
			});
			requireAfterWrite(
				'func_code_output2.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			const json = info.squeeze().toJSON();
			delete json.code;
			requireAfterWrite('func_code_output2_squeeze.json', json);

			const translateWords = autoTestUtils.getCodeTranslateAllWords(info);
			const otherTranslateWords = requireAfterWrite(
				'translate_words_code.json',
				translateWords
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(exampleCode_output)
			);
			expect(translateWords).to.eql(otherTranslateWords);
		});
	});

	describe('#use require', function() {
		const requireAfterWrite = autoTestUtils.requireAfterWrite(
			'example_use_require'
		);

		it('#base', function() {
			const mainFile = './i18nc_options/file_path.js';
			const i18nOptions = {
				mainFile: mainFile,
				dbTranslateWords: dbTranslateWords,
				loadTranslateJSON: function(emitData) {
					const ast = emitData.original;

					if (
						ast.type == 'CallExpression' &&
						ast.callee &&
						ast.callee.name == 'require' &&
						ast.arguments &&
						ast.arguments[0] &&
						ast.arguments[0].type == 'Literal'
					) {
						expect(emitData.options.originalOptions.mainFile).to.be(
							mainFile
						);
						const file = ast.arguments[0].value;
						debug('loadTranslateJSON:%s', file);
						expect(file).to.be('./require_data.json');

						emitData.result = autoTestUtils.isBuild()
							? {}
							: requireAfterWrite(file);
					} else {
						expect().fail();
					}
				},
				newTranslateJSON: function(emitData) {
					debug('newTranslateJSON:%s', emitData.result);
					expect(emitData.options.originalOptions.mainFile).to.be(
						mainFile
					);
					const content = 'var obj = ' + emitData.result;
					const otherContent = requireAfterWrite(
						'require_data.js',
						content
					);
					expect(autoTestUtils.code2arr(content)).to.eql(
						autoTestUtils.code2arr(otherContent)
					);

					const otherJSON = requireAfterWrite(
						'require_data.json',
						emitData.originalJSON
					);
					expect(emitData.originalJSON).to.be.eql(otherJSON);

					emitData.result = 'require("./require_data.json")';
				}
			};

			const exampleCode = require('./files/casefile/func_code/func_code_example_use_require');
			const info = i18nc(exampleCode.toString(), i18nOptions);
			const otherCode = requireAfterWrite(
				'func_code_output.js',
				'module.exports = ' + info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});
});

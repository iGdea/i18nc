/*
 * safari foxmail min出来的模版变量和v8的结果不同
 * 所以不能用v8的结果去匹配，所以不在浏览器环境下跑测试用例
 * 但功能没有问题
 */

'use strict';

const expect = require('expect.js');
const i18nc = require('../');
const dbTranslateWords = require('./files/casefile/translate_words_db');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('main_options_mincode');
const collectFuncs = require('./files/casefile/func_code/func_code_collect');

describe('#main_options_mincode', function() {
	function test(name) {
		describe(name, function() {
			const filename =
				'func_code_i18n_min_' + name.toLowerCase() + '_output';

			it('#base', function() {
				const code = collectFuncs.has_words;
				const info = i18nc(code.toString(), {
					minTranslateFuncCode: name
				});

				const otherCode = requireAfterWrite(
					filename + '_base.js',
					info.code
				);

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			it('#wdithdb', function() {
				const code = collectFuncs.has_words;
				const info = i18nc(code.toString(), {
					dbTranslateWords: dbTranslateWords,
					minTranslateFuncCode: name
				});

				const otherCode = requireAfterWrite(
					filename + '_widthdb.js',
					info.code
				);

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			it('#partialUpdate', function() {
				const code = require('./files/casefile/i18n_handler/i18n_handler_example.js');
				const funcInfo = require('./files/casefile/i18n_handler/i18n_handler_example_output.json');
				let codeData = {
					DEFAULTS: Object.keys(
						funcInfo.__TRANSLATE_JSON__['en-US'].DEFAULTS
					)
				};

				codeData = '\nvar codeJSON=' + JSON.stringify(codeData, null, '\t');
				// println(codeData);

				const info = i18nc(code.toString() + codeData, {
					dbTranslateWords: dbTranslateWords,
					minTranslateFuncCode: name
				});
				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					filename + '_partiaupdate.js',
					wrapCode
				);

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});
		});
	}

	test('all');
	test('onlyFunc');
});

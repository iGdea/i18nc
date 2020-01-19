/* global println */

'use strict';

const expect = require('expect.js');
const i18nc = require('../');
const DEF = require('../lib/def');
const dbTranslateWords = require('./files/casefile/translate_words_db');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('main');

describe('#main', function() {
	describe('#widthdb funcData', function() {
		let exampleCode = require('./files/casefile/i18n_handler/i18n_handler_example.js');
		exampleCode = exampleCode.toString();

		it('#nocode', function() {
			const info = i18nc(exampleCode, {
				dbTranslateWords: dbTranslateWords
			});

			const outputJSON = requireAfterWrite(
				'i18n_handler_example_i18nc_nocode_output.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			const otherCode = requireAfterWrite(
				'i18n_handler_example_i18nc_nocode_output.js',
				info.code
			);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr('' + info)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#withcode', function() {
			const funcInfo = require('./files/casefile/i18n_handler/i18n_handler_example_output.json');
			let codeData = {
				DEFAULTS: Object.keys(
					funcInfo.__TRANSLATE_JSON__['en-US'].DEFAULTS
				),
				SUBKEYS: {
					subkey: Object.keys(
						funcInfo.__TRANSLATE_JSON__['en-US'].SUBKEYS.subkey
					)
				}
			};

			codeData = '\nvar codeJSON = ' + JSON.stringify(codeData, null, '\t');

			const info = i18nc(exampleCode + codeData, {
				dbTranslateWords: dbTranslateWords
			});

			const outputJSON = requireAfterWrite(
				'i18n_handler_example_i18nc_withcode_output.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
			const otherCode = requireAfterWrite(
				'i18n_handler_example_i18nc_withcode_output.js',
				wrapCode
			);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#insert when noi18n', function() {
		it('#noI18N', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_noi18n').toString();
			const info = i18nc(exampleCode);

			const otherCode = requireAfterWrite(
				'func_code_noi18n_output.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#noI18N noclosure', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_noi18n').toString();
			const info = i18nc(exampleCode, {
				isCheckClosureForNewI18NHandler: false
			});

			const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
			const otherCode = requireAfterWrite(
				'func_code_noi18n_output_noclosure.js',
				wrapCode
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#define', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_i18n_define').toString();
			const info = i18nc(exampleCode);

			const otherCode = requireAfterWrite(
				'func_code_i18n_define_output.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#define not_define', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_i18n_define').toString();
			const info = i18nc(exampleCode, {
				isInsertToDefineHalder: false
			});

			const otherCode = requireAfterWrite(
				'func_code_i18n_define_output_notdefine.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#simple i18n', function() {
		it('#one i18n', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_i18n').toString();
			const info = i18nc(exampleCode);

			const otherCode = requireAfterWrite(
				'func_code_i18n_output.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#define and scope', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_i18n_define').toString();
			const info = i18nc(exampleCode, {
				dbTranslateWords: {
					zh: {
						'*': {
							DEFAULTS: {
								'global 中文1': 'global 中文1',
								'define1 中文': 'define1 中文',
								'define2 中文': 'define2 中文',
								'global 中文2': 'global 中文2'
							}
						}
					}
				}
			});

			const otherCode = requireAfterWrite(
				'func_code_i18n_define_output_words.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#no words', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_i18n_nowords').toString();
			const info = i18nc(exampleCode);

			const otherCode = requireAfterWrite(
				'func_code_i18n_nowords_output.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#global i18n', function() {
		it('#new code', function() {
			const exampleCode = require('./files/casefile/func_code/func_code_i18n_global_handler').toString();
			const info = i18nc(exampleCode);

			const otherCode = requireAfterWrite(
				'func_code_i18n_global_handler_output.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#dbTranslate', function() {
		describe('#no db', function() {
			const code = 'println("不可能存在的中文翻译词组");';

			it('#noanything', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: false
				});

				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_no_db.js',
					wrapCode
				);

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			it('#only lan', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: false,
					dbTranslateWords: {
						en: {
							'*': { DEFAULTS: {} }
						}
					}
				});

				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_no_db_only_lan.js',
					wrapCode
				);

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			it('#other_db', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: false,
					dbTranslateWords: {
						en: {
							'*': { DEFAULTS: { 嘿嘿: 'hihi' } }
						}
					}
				});

				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_no_db_other_db.js',
					wrapCode
				);

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});
		});

		it('#use default lan', function() {
			let code = function code() {
				println('不可能存在的中文翻译词组', I18N);
				function I18N() {
					const self = I18N;
					self.__FILE_KEY__ = 'default_file_key';
					self.__FUNCTION_VERSION__ = '$FUNCTION_VERSION$';
					self.__TRANSLATE_JSON__ = {
						$: ['en'],
						'*': { '1': ['2'] }
					};
				}
			};
			code = code
				.toString()
				.replace(/\$FUNCTION_VERSION\$/, DEF.I18NFunctionVersion);
			const info = i18nc(code);
			const otherCode = requireAfterWrite(
				'func_code_default_lan.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#update lan by db', function() {
			let code = function code() {
				println('简体', I18N);
				function I18N() {
					const self = I18N;
					self.__FILE_KEY__ = 'default_file_key';
					self.__FUNCTION_VERSION__ = '$FUNCTION_VERSION$';
					self.__TRANSLATE_JSON__ = {
						$: ['en'],
						'*': { '1': ['2'] }
					};
				}
			};
			code = code
				.toString()
				.replace(/\$FUNCTION_VERSION\$/, DEF.I18NFunctionVersion);
			const info = i18nc(code, {
				dbTranslateWords: {
					'zh-TW': {
						'*': { DEFAULTS: { 简体: '簡體' } }
					}
				}
			});
			const otherCode = requireAfterWrite(
				'func_code_update_by_db.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#core style', function() {
		it('#width head / end', function() {
			const info = i18nc(
				'/* begin */\ndefine(function(){println("中文")})\n/* end */\n'
			);

			const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
			const otherCode = requireAfterWrite(
				'func_code_head_has_content_output.js',
				wrapCode
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#special chars', function() {
		it('#\\n\\r', function() {
			const info = i18nc(
				'function a(){println("\\n\\r"); println("\\n")}',
				{
					cutwordReg: /\s+/g,
					dbTranslateWords: {
						$: [],
						'en-US': {
							'*': { DEFAULTS: { '\n': 'new line\n' } }
						}
					}
				}
			);
			const otherCode = requireAfterWrite(
				'func_code_special_chars1.js',
				info.code
			);
			eval(info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#\\u2029', function() {
			const info = i18nc(
				'function a(){println("\\u2029\\u2029"); println("\\u2029")}',
				{
					cutwordReg: /\u2029+/g,
					dbTranslateWords: {
						'en-US': {
							'*': { DEFAULTS: { '\u2029': 'new line\u2029' } }
						}
					}
				}
			);
			const otherCode = requireAfterWrite(
				'func_code_special_chars2.js',
				info.code
			);
			eval(info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#result', function() {
		describe('#dirtyWords', function() {
			it('#ObjectKey', function() {
				const code = function code() {
					const d = {
						'中文key': '中文val'
					};

					console.log(d);
				};

				const info = i18nc(code.toString());

				expect(info.allDirtyWords().toArray()).to.eql(['\'中文key\'']);
			});
		});
	});
});

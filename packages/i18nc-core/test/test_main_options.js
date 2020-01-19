'use strict';

const expect = require('expect.js');
const i18nc = require('../');
const dbTranslateWords = require('./files/casefile/translate_words_db');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('main_options');
const collectFuncs = require('./files/casefile/func_code/func_code_collect');

describe('#main_options', function() {
	describe('#ignoreScanHandlerNames', function() {
		it('#ignore simple callee', function() {
			const info = i18nc('somefunc("中文")', {
				ignoreScanHandlerNames: ['somefunc']
			});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();
		});

		it('#ignore MemberExpression callee', function() {
			let info = i18nc('obj.log("中文")', {
				ignoreScanHandlerNames: ['obj.log']
			});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();

			info = i18nc('obj.obj.log("中文")', {
				ignoreScanHandlerNames: ['obj.obj.log']
			});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();
		});

		it('#ignore define', function() {
			const info = i18nc('function somefunc(){println("中文")}', {
				ignoreScanHandlerNames: ['somefunc']
			});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();
		});
	});

	it('#cutword', function() {
		const code = collectFuncs.no_words;

		const info = i18nc(code.toString(), {
			cutword: function(emitData) {
				emitData.result = [
					{
						translateWord: true,
						value: emitData.originalString
					}
				];
			}
		});

		const otherCode = requireAfterWrite(
			'func_code_cutword_output.js',
			info.code
		);

		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherCode)
		);
	});

	it('#isInjectAllTranslateWords', function() {
		const code = collectFuncs.has_words;
		const info = i18nc(code.toString(), {
			isInjectAllTranslateWords: false
		});

		const otherCode = requireAfterWrite(
			'func_code_no_notused_words_output.js',
			info.code
		);
		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherCode)
		);
	});

	it('#depdEnable', function() {
		const info = i18nc('var dd = "中文"', {
			cutWordReg: /词典/g,
			I18NHandler: { insert: { checkClosure: false } },
			depdEnable: false
		});

		const otherCode = requireAfterWrite(
			'func_code_no_depdenable_output.js',
			info.code
		);
		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherCode)
		);
	});

	describe('#I18NHandler', function() {
		describe('#upgrade', function() {
			it('#enable', function() {
				const exampleCode = require('./files/casefile/func_code/func_code_example.js').toString();
				const info = i18nc(exampleCode, {
					I18NHandler: { upgrade: false },
					dbTranslateWords: dbTranslateWords
				});

				const otherCode = requireAfterWrite(
					'func_code_upgrade_disable.js',
					info.code
				);
				const outputJSON = requireAfterWrite(
					'func_code_upgrade_disable.json',
					autoTestUtils.JsonOfI18ncRet(info)
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
				expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			});

			it('#updateJSON', function() {
				const code = require('./files/casefile/i18n_handler/i18n_handler_example').toString();
				const info = i18nc(code, {
					I18NHandler: {
						upgrade: { updateJSON: false }
					},
					dbTranslateWords: dbTranslateWords
				});

				const otherCode = requireAfterWrite(
					'func_code_upgrade_updatejson.js',
					info.code
				);
				const outputJSON = requireAfterWrite(
					'func_code_upgrade_updatejson.json',
					autoTestUtils.JsonOfI18ncRet(info)
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
				expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			});
		});

		describe('#insert', function() {
			it('#enable', function() {
				const info = i18nc('var dd = "中文"', {
					I18NHandler: { insert: false }
				});

				const otherCode = requireAfterWrite(
					'func_code_insert_disable.js',
					info.code
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});
		});
	});

	describe('#codeModifiedArea', function() {
		// var exampleCode = require('./files/casefile/func_code/func_code_example.js').toString();
		const exampleCode = require('./files/casefile/func_code/func_code_i18n.js').toString();

		it('#only translateWord', function() {
			const info = i18nc(exampleCode, {
				codeModifiedArea: ['TranslateWord'],
				dbTranslateWords: dbTranslateWords
			});

			const otherCode = requireAfterWrite(
				'func_code_codeModifiedArea2_output.js',
				info.code
			);
			const outputJSON = requireAfterWrite(
				'func_code_codeModifiedArea2_output.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
		});

		it('#no regexp', function() {
			const code = 'var dd = /中文/;';
			const info = i18nc(code, {
				codeModifiedArea: []
			});
			expect(info.code).to.be('var dd = /中文/;');

			const info2 = i18nc(code, {
				// isCheckClosureForNewI18NHandler: false,
				codeModifiedArea: {
					I18NHandler: false,
					TranslateWord_RegExp: true
				}
			});
			expect(info2.code).to.be('var dd = new RegExp(I18N(\'中文\'));');
		});

		it('#empty', function() {
			const info = i18nc(exampleCode, {
				codeModifiedArea: [],
				dbTranslateWords: dbTranslateWords
			});

			const otherCode = requireAfterWrite(
				'func_code_codeModifiedArea3_output.js',
				info.code
			);
			const outputJSON = requireAfterWrite(
				'func_code_codeModifiedArea3_output.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
		});
	});

	it('#pickFileLanguages', function() {
		const code = 'println("不可能存在的中文翻译词组");';
		const info = i18nc(code, {
			isCheckClosureForNewI18NHandler: false,
			pickFileLanguages: ['en-US']
		});

		const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
		const otherCode = requireAfterWrite(
			'func_code_no_db_set_lans.js',
			wrapCode
		);

		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherCode)
		);
	});

	it('#isInsertI18NHandler', function() {
		const info = i18nc('var a = "中文"', {
			codeModifiedArea: { I18NHandler: false }
		});

		const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
		const otherCode = requireAfterWrite(
			'func_code_no_insert_i18n_handler.js',
			wrapCode
		);

		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherCode)
		);
	});

	describe('#isCheckClosureForNewI18NHandler', function() {
		describe('#closure', function() {
			const code = 'function code(){var words = "中文"}';

			it('#use', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: true
				});
				const otherCode = requireAfterWrite(
					'func_code_closure_closure.js',
					info.code
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			it('#no use', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: false
				});
				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_closure_noclosure.js',
					wrapCode
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});
		});

		describe('#noclosure', function() {
			const code = 'var words = "中文"';

			it('#use', function() {
				expect(function() {
					i18nc(code, { isCheckClosureForNewI18NHandler: true });
				}).to.throwError(/closure by youself/);
			});

			it('#no use', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: false
				});
				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_noclosure_noclosure.js',
					wrapCode
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});
		});

		// 没有处理前，会报closure myself错误
		describe('#FunctionExpression closure', function() {
			const code = '(function(){var words = "中文"})();';

			it('#use', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: true
				});
				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_closure_funcexp_closure.js',
					wrapCode
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			it('#no use', function() {
				const info = i18nc(code, {
					isCheckClosureForNewI18NHandler: false
				});
				const wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				const otherCode = requireAfterWrite(
					'func_code_closure_funcexp_noclosure.js',
					wrapCode
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});
		});
	});

	it('#isIgnoreI18NHandlerTranslateWords', function() {
		const code = require('./files/casefile/func_code/func_code_example').toString();
		const info = i18nc(code, {
			isIgnoreI18NHandlerTranslateWords: true,
			dbTranslateWords: {
				'zh-TW': {
					'*': { DEFAULTS: { 简体: '簡體' } }
				}
			}
		});
		const otherCode = requireAfterWrite(
			'func_code_ignore_func_words.js',
			info.code
		);
		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherCode)
		);
	});

	describe('#proxyGlobalHandler', function() {
		const code = require('./files/casefile/func_code/func_code_i18n_global_handler').toString();

		it('#isProxyGlobalHandler', function() {
			const code = require('./files/casefile/func_code/func_code_noi18n').toString();
			const info = i18nc(code, {
				isProxyGlobalHandler: true
			});
			const otherCode = requireAfterWrite(
				'func_code_noi18n_proxy_global.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#isProxyGlobalHandler', function() {
			const info = i18nc(code, {
				isProxyGlobalHandler: true
			});
			const otherCode = requireAfterWrite(
				'func_code_noi18n_proxy_global_auto_convert.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#isIgnoreCodeProxyGlobalHandlerName', function() {
			const info = i18nc(code, {
				isProxyGlobalHandler: true,
				isIgnoreCodeProxyGlobalHandlerName: true,
				proxyGlobalHandlerName: 'topI18N2'
			});
			const otherCode = requireAfterWrite(
				'func_code_i18n_global_handler_ignore_code.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#no autoConvert', function() {
			const info = i18nc(code, {
				I18NHandler: {
					style: {
						proxyGlobalHandler: {
							enable: false,
							autoConvert: false
						}
					}
				}
			});
			const otherCode = requireAfterWrite(
				'func_code_i18n_global_handler_no_auto_convert.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});

	describe('#fullHandler', function() {
		const code = require('./files/casefile/func_code/func_code_i18n_full_handler').toString();

		it('#autoConvert', function() {
			const info = i18nc(code, {
				I18NHandler: {
					style: {
						codeStyle: 'proxyGlobalHandler',
						fullHandler: {
							autoConvert: true
						}
					}
				}
			});
			const otherCode = requireAfterWrite(
				'func_code_i18n_full_handler_auto_convert.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#no autoConvert', function() {
			const info = i18nc(code, {
				I18NHandler: {
					style: {
						codeStyle: 'proxyGlobalHandler',
						fullHandler: {
							autoConvert: false
						}
					}
				}
			});
			const otherCode = requireAfterWrite(
				'func_code_i18n_full_handler_no_auto_convert.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});
});

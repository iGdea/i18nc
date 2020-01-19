'use strict';

const expect = require('expect.js');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('upgrade');
const i18nc = require('../');
const initOptions = require('i18nc-options').init;

describe('#upgrade', function() {
	describe('#options', function() {
		describe('#rename', function() {
			it('#1keyTo1key', function() {
				const code = require('./files/casefile/func_code/func_code_noi18n').toString();
				const info = i18nc(code, {
					handlerName: 'oldI18N',
					cutWordReg: /中/g
				});
				const otherCode = requireAfterWrite(
					'func_code_noi18n_rename.js',
					info.code
				);
				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(otherCode)
				);
			});

			describe('#rename for obj', function() {
				it('#key2obj', function() {
					let newOptions = initOptions();
					expect(newOptions.I18NHandler.insert.checkClosure).to.be(
						true
					);
					newOptions = initOptions({
						isCheckClosureForNewI18NHandler: false
					});
					expect(newOptions.I18NHandler.insert.checkClosure).to.be(
						false
					);
				});

				it('#obj2obj', function() {
					let newOptions = initOptions();
					expect(newOptions.I18NHandler.upgrade.checkVersion).to.be(
						true
					);
					newOptions = initOptions({
						I18NHandler: { upgrade: { version: false } }
					});
					expect(newOptions.I18NHandler.upgrade.checkVersion).to.be(
						false
					);
				});

				it('#obj2key', function() {
					console.log('@todo');
				});
			});

			describe('#rename for arr', function() {
				it('#arr2obj', function() {
					let newOptions = initOptions();
					expect(newOptions.I18NHandler.upgrade.enable).to.be(true);
					newOptions = initOptions({ codeModifiedArea: [] });
					expect(newOptions.I18NHandler.upgrade.enable).to.be(false);
					newOptions = initOptions({
						codeModifiedArea: ['I18NHandler']
					});
					expect(newOptions.I18NHandler.upgrade.enable).to.be(true);
				});

				it('#arr2arr', function() {
					let newOptions = initOptions();
					expect(newOptions.codeModifyItems.I18NHandlerAlias).to.be(
						true
					);
					newOptions = initOptions({ codeModifiedArea: [] });
					expect(newOptions.codeModifyItems.I18NHandlerAlias).to.be(
						undefined
					);
					newOptions = initOptions({
						codeModifiedArea: ['I18NHandlerAlias']
					});
					expect(newOptions.codeModifyItems.I18NHandlerAlias).to.be(
						true
					);
				});
			});
		});

		it('#I18NhandlerTpl', function() {
			const code = require('./files/casefile/func_code/func_code_noi18n').toString();
			const info = i18nc(code, {
				I18NhandlerTpl_GetGlobalCode: 'window.settings',
				I18NhandlerTpl_LanguageVarName: '_lan_'
			});
			const otherCode = requireAfterWrite(
				'func_code_noi18n_new_style.js',
				info.code
			);
			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		describe('#isMinFuncTranslateCode', function() {
			const code = require('./files/casefile/func_code/func_code_noi18n').toString();
			it('#true', function() {
				const info = i18nc(code, {
					isMinFuncTranslateCode: true
				});

				const info2 = i18nc(code, {
					minTranslateFuncCode: 'all'
				});

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(info2.code)
				);
			});

			it('#false', function() {
				const info = i18nc(code, {
					isMinFuncTranslateCode: false
				});

				const info2 = i18nc(code, {
					minTranslateFuncCode: 'onlyFunc'
				});

				expect(autoTestUtils.code2arr(info.code)).to.eql(
					autoTestUtils.code2arr(info2.code)
				);
			});
		});
	});
});

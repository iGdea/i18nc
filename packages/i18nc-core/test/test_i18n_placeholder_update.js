'use strict';

const expect = require('expect.js');
const astUtil = require('i18nc-ast').util;
const initOptions = require('i18nc-options').init;
const prevTestFiles = require('./prev_test_files');
const DEF = require('../lib/def');
const i18nTpl = require('../lib/i18n_func/render');
const I18NPlaceholder = require('../lib/i18n_placeholder').I18NPlaceholder;

describe('#i18n_placeholder_update', function() {
	describe('#check', function() {
		function checkEmptyJSONCode(code, renderType, options) {
			const ast = astUtil.parse(code);
			const codeTranslateWords = {};
			const I18NPlaceholderNew = new I18NPlaceholder(
				codeTranslateWords,
				code,
				initOptions(options),
				ast.body[0]
			);
			expect(I18NPlaceholderNew.getRenderType()).to.be(renderType);
		}

		function checkWidthJSONCode(code, renderType, options) {
			const ast = astUtil.parse(code);
			const codeTranslateWords = {
				DEFAULTS: ['中文']
			};
			const I18NPlaceholderNew = new I18NPlaceholder(
				codeTranslateWords,
				code,
				initOptions(options),
				ast.body[0]
			);
			expect(I18NPlaceholderNew.getRenderType()).to.be(renderType);
		}

		describe('#tpls', function() {
			it('#full', function() {
				const code = prevTestFiles.I18NHandlerExampleCode();
				checkEmptyJSONCode(code, 'partial');
				checkWidthJSONCode(code, 'partial');
			});

			it('#simple', function() {
				const code = prevTestFiles.I18NHandlerSimpleExampleCode();
				checkEmptyJSONCode(code, 'complete');
				checkWidthJSONCode(code, 'complete');
			});

			it('#global', function() {
				const code = prevTestFiles.I18NHandlerGlobalExampleCode();
				checkEmptyJSONCode(code, 'partial');
				checkWidthJSONCode(code, 'partial');
			});
		});

		describe('#triggers', function() {
			describe('#diff version', function() {
				const code = i18nTpl.render({
					handlerName: 'I18N',
					getLanguageCode: 'GetLanGlobal',
					FILE_KEY: '*',
					FUNCTION_VERSION: '0',
					TRANSLATE_JSON_CODE: '{}'
				});

				it('#enable', function() {
					checkEmptyJSONCode(code, 'complete');
					checkWidthJSONCode(code, 'complete');
				});

				it('#disable', function() {
					const options = {
						I18NHandler: { upgrade: { checkVersion: false } }
					};
					checkEmptyJSONCode(code, 'partial', options);
					checkEmptyJSONCode(code, 'partial', options);
				});
			});

			it('#no file_key', function() {
				const code = i18nTpl.render({
					handlerName: 'I18N',
					getLanguageCode: 'GetLanGlobal',
					FILE_KEY: '',
					FUNCTION_VERSION:
						DEF.I18NFunctionVersion +
						DEF.I18NFunctionSubVersion.FULL,
					TRANSLATE_JSON_CODE: '{}'
				});
				checkEmptyJSONCode(code, 'original');
				checkWidthJSONCode(code, 'complete');
			});
		});
	});

	describe('#update', function() {
		function I18N() {
			const self = I18N;
			self.__FILE_KEY__ = 'file_key';
			self.__FUNCTION_VERSION__ = '5';
			self.__TRANSLATE_JSON__ = { DEFAULTS: { key: 1 } };
		}
		const code = I18N.toString();
		const codeTranslateWords = {
			DEFAULTS: ['中文']
		};

		function code2arr(code) {
			return code.split(/\n\r?\t*/).filter(function(val) {
				return val;
			});
		}

		function func2codeArr(func) {
			return code2arr(func.toString());
		}

		it('#partial', function() {
			const ast = astUtil.parse(code);
			const I18NPlaceholderNew = new I18NPlaceholder(
				codeTranslateWords,
				code,
				initOptions(),
				ast.body[0]
			);

			I18NPlaceholderNew.renderType = 'partial';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(
				func2codeArr(function I18N() {
					const self = I18N;
					self.__FILE_KEY__ = 'file_key';
					self.__FUNCTION_VERSION__ = '5';
					self.__TRANSLATE_JSON__ = {
						'en-US': {
							'DEFAULTS': {
								// '中文':
							}
						}
					};
				})
			);
		});

		it('#original', function() {
			const ast = astUtil.parse(code);
			const I18NPlaceholderNew = new I18NPlaceholder(
				codeTranslateWords,
				code,
				initOptions(),
				ast.body[0]
			);

			I18NPlaceholderNew.renderType = 'original';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(code2arr(code));
		});

		it('#empty', function() {
			const ast = astUtil.parse(code);
			const I18NPlaceholderNew = new I18NPlaceholder(
				codeTranslateWords,
				code,
				initOptions(),
				ast.body[0]
			);

			I18NPlaceholderNew.renderType = 'empty';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql([]);
		});

		it('#simple', function() {
			const ast = astUtil.parse(code);
			const I18NPlaceholderNew = new I18NPlaceholder(
				codeTranslateWords,
				code,
				initOptions(),
				ast.body[0]
			);

			I18NPlaceholderNew.renderType = 'simple';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(
				code2arr(
					i18nTpl.renderSimple({
						handlerName: 'I18N',
						FILE_KEY: 'file_key',
						FUNCTION_VERSION:
							DEF.I18NFunctionVersion +
							DEF.I18NFunctionSubVersion.SIMPLE
					})
				)
			);
		});

		it('#complete', function() {
			const ast = astUtil.parse(code);
			const I18NPlaceholderNew = new I18NPlaceholder(
				{},
				code,
				initOptions({
					I18NHandlerTPL_GetLanguageCode: 'GetLanguageCode'
				}),
				ast.body[0]
			);

			I18NPlaceholderNew.renderType = 'complete';
			const options = initOptions();
			const otherCode = i18nTpl.render({
				handlerName: options.I18NHandlerName,
				getLanguageCode: 'GetLanguageCode',
				FILE_KEY: 'file_key',
				FUNCTION_VERSION:
					DEF.I18NFunctionVersion + DEF.I18NFunctionSubVersion.FULL,
				TRANSLATE_JSON_CODE: '{}'
			});
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(
				code2arr(otherCode)
			);
		});
	});
});

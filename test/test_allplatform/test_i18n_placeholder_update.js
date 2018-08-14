'use strict';

var expect			= require('expect.js');
var esprima			= require('esprima');
var prevTestFiles	= require('../prev_test_files');
var DEF				= require('../../lib/def');
var optionsUtils	= require('../../lib/options');
var i18nTpl			= require('../../lib/i18n_func/render');
var I18NPlaceholder	= require('../../lib/i18n_placeholder').I18NPlaceholder;


describe('#i18n_placeholder_update', function()
{
	describe('#check', function()
	{
		function checkEmptyJSONCode(code, renderType, options)
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var codeTranslateWords = {};
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(options), ast.body[0]
				);
			expect(I18NPlaceholderNew.getRenderType()).to.be(renderType);
		}

		function checkWidthJSONCode(code, renderType, options)
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var codeTranslateWords = {
				DEFAULTS: ['中文']
			};
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(options), ast.body[0]
				);
			expect(I18NPlaceholderNew.getRenderType()).to.be(renderType);
		}

		describe('#tpls', function()
		{
			it('#full', function()
			{
				var code = prevTestFiles.I18NHandlerExampleCode();
				checkEmptyJSONCode(code, 'partial');
				checkWidthJSONCode(code, 'partial');
			});

			it('#simple', function()
			{
				var code = prevTestFiles.I18NHandlerSimpleExampleCode();
				checkEmptyJSONCode(code, 'complete');
				checkWidthJSONCode(code, 'complete');
			});

			it('#global', function()
			{
				var code = prevTestFiles.I18NHandlerGlobalExampleCode();
				checkEmptyJSONCode(code, 'partial');
				checkWidthJSONCode(code, 'partial');
			});
		});

		describe('#triggers', function()
		{
			describe('#diff version', function()
			{
				var code = i18nTpl.render(
				{
					handlerName: 'I18N',
					getLanguageCode: 'GetLanGlobal',
					FILE_KEY: '*',
					FUNCTION_VERSION: '0',
					TRANSLATE_JSON_CODE : '{}'
				});

				it('#enable', function()
				{
					checkEmptyJSONCode(code, 'complete');
					checkWidthJSONCode(code, 'complete');
				});

				it('#disable', function()
				{
					var options = {I18NHandler: {upgrade: {checkVersion: false}}};
					checkEmptyJSONCode(code, 'partial', options);
					checkEmptyJSONCode(code, 'partial', options);
				});
			});

			it('#no file_key', function()
			{
				var code = i18nTpl.render(
				{
					handlerName: 'I18N',
					getLanguageCode : 'GetLanGlobal',
					FILE_KEY: '',
					FUNCTION_VERSION: DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.FULL,
					TRANSLATE_JSON_CODE : '{}'
				});
				checkEmptyJSONCode(code, 'original');
				checkWidthJSONCode(code, 'complete');
			});
		});


	});


	describe('#update', function()
	{
		function I18N()
		{
			var self = I18N;
			self.__FILE_KEY__ = "file_key";
			self.__FUNCTION_VERSION__ = "5";
			self.__TRANSLATE_JSON__ = {DEFAULTS: {key: 1}};
		}
		var code = I18N.toString();
		var codeTranslateWords =
		{
			DEFAULTS: ['中文']
		};

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
			return code2arr(func.toString());
		}

		it('#partial', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'partial';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(func2codeArr(function I18N()
				{
					var self = I18N;
					self.__FILE_KEY__ = "file_key";
					self.__FUNCTION_VERSION__ = "5";
					self.__TRANSLATE_JSON__ = {
						'en-US': {
							'DEFAULTS': {
								// '中文':
								'': null
							}
						}
					};
				}));
		});

		it('#original', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'original';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(code2arr(code));
		});

		it('#empty', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'empty';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql([]);
		});

		it('#simple', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'simple';
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(code2arr(i18nTpl.renderSimple(
				{
					handlerName: 'I18N',
					FILE_KEY: 'file_key',
					FUNCTION_VERSION: DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.SIMPLE,
				})));
		});

		it('#complete', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					{}, code, optionsUtils.extend({I18NHandlerTPL_GetLanguageCode: 'GetLanguageCode'}), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'complete';
			var options = optionsUtils.extend();
			var otherCode = i18nTpl.render(
				{
					handlerName         : options.I18NHandlerName,
					getLanguageCode		: 'GetLanguageCode',
					FILE_KEY            : 'file_key',
					FUNCTION_VERSION    : DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.FULL,
					TRANSLATE_JSON_CODE : '{}'
				});
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(code2arr(otherCode));
		});
	});
});

var expect = require('expect.js');
var esprima = require('esprima');
var DEF = require('../lib/def');
var optionsUtils = require('../lib/options');
var prevTestFiles = require('./prev_test_files');
var i18nTpl = require('../lib/i18n_func/render');
var I18NPlaceholder = require('../lib/i18n_placeholder').I18NPlaceholder;


describe('#i18n_func_update', function()
{
	describe('#check', function()
	{
		function checkEmptyJSONCode(code, renderType)
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var codeTranslateWords = {};
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);
			expect(I18NPlaceholderNew.getRenderType()).to.be(renderType);
		}

		function checkWidthJSONCode(code, renderType)
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var codeTranslateWords = {
				DEFAULTS: ['中文']
			};
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);
			expect(I18NPlaceholderNew.getRenderType()).to.be(renderType);
		}

		it('#example', function()
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

		it('#diff version', function()
		{
			var code = i18nTpl.render(
				{
					handlerName: 'I18N',
					FILE_KEY: '*',
					FUNCTION_VERSION: 0,
					GetGlobalCode : 'window',
					LanguageVarName : '__i18n_lan__',
					TRANSLATE_JSON_CODE : '{}'
				});
			checkEmptyJSONCode(code, 'complete');
			checkWidthJSONCode(code, 'complete');
		});

		it('#no file_key', function()
		{
			var code = i18nTpl.render(
				{
					handlerName: 'I18N',
					FILE_KEY: '',
					FUNCTION_VERSION: DEF.I18NFunctionVersion,
					GetGlobalCode : 'window',
					LanguageVarName : '__i18n_lan__',
					TRANSLATE_JSON_CODE : '{}'
				});
			checkEmptyJSONCode(code, 'orignal');
			checkWidthJSONCode(code, 'complete');
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
		var codeTranslateWords = {
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
								// "中文":
								'<e.g.> translate word': null
							}
						}
					};
				}));
		});

		it('#orignal', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					codeTranslateWords, code, optionsUtils.extend(), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'orignal';
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
					FUNCTION_VERSION: DEF.I18NFunctionVersion+'.'+DEF.I18NFunctionSubVersion.SIMPLE,
				})));
		});

		it('#complete', function()
		{
			var ast = esprima.parse(code, optionsUtils.esprimaOptions);
			var I18NPlaceholderNew = new I18NPlaceholder(
					{}, code, optionsUtils.extend(), ast.body[0]
				);

			I18NPlaceholderNew.renderType = 'complete';
			var options = optionsUtils.extend();
			var otherCode = i18nTpl.render(
				{
					handlerName: options.I18NHandlerName,
					FILE_KEY: 'file_key',
					FUNCTION_VERSION: DEF.I18NFunctionVersion,
					GetGlobalCode : options['I18NhandlerTpl:GetGlobalCode'],
					LanguageVarName : options['I18NhandlerTpl:LanguageVarName'],
					TRANSLATE_JSON_CODE : '{}'
				});
			expect(func2codeArr(I18NPlaceholderNew)).to.eql(code2arr(otherCode));
		});
	});
});

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
		it('#partial', function()
		{
			console.log('@todo');
		});

		it('#orignal', function()
		{
			console.log('@todo');
		});

		it('#empty', function()
		{
			console.log('@todo');
		});

		it('#simple', function()
		{
			console.log('@todo');
		});

		it('#complete', function()
		{
			console.log('@todo');
		});

		it('#simple2complete', function()
		{
			console.log('@todo');
		});
	});
});

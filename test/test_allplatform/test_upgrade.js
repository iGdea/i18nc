'use strict';

var expect				= require('expect.js');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('upgrade');
var i18nc				= require('../../');
var optionsUtils		= require('../../lib/options');

describe('#upgrade', function()
{
	describe('#options', function()
	{
		describe('#rename', function()
		{
			it('#1keyTo1key', function()
			{
				var code = require('../files/casefile/func_code/func_code_noi18n').toString();
				var info = i18nc(code,
					{
						handlerName: 'oldI18N',
						cutWordReg: /中/g,
					});
				var otherCode = requireAfterWrite('func_code_noi18n_rename.js', info.code);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			describe('#rename for obj', function()
			{
				it('#key2obj', function()
				{
					var newOptions = optionsUtils.extend();
					expect(newOptions.I18NHandler.insert.checkClosure).to.be(true);
					newOptions = optionsUtils.extend({isCheckClosureForNewI18NHandler: false});
					expect(newOptions.I18NHandler.insert.checkClosure).to.be(false);
				});

				it('#obj2obj', function()
				{
					var newOptions = optionsUtils.extend();
					expect(newOptions.I18NHandler.upgrade.checkVersion).to.be(true);
					newOptions = optionsUtils.extend({I18NHandler: {upgrade: {version: false}}});
					expect(newOptions.I18NHandler.upgrade.checkVersion).to.be(false);
				});

				it('#obj2key', function()
				{
					console.log('@todo');
				});
			});

			describe('#rename for arr', function()
			{
				it('#arr2obj', function()
				{
					var newOptions = optionsUtils.extend();
					expect(newOptions.I18NHandler.upgrade.enable).to.be(true);
					newOptions = optionsUtils.extend({codeModifiedArea: []});
					expect(newOptions.I18NHandler.upgrade.enable).to.be(false);
					newOptions = optionsUtils.extend({codeModifiedArea: ['I18NHandler']});
					expect(newOptions.I18NHandler.upgrade.enable).to.be(true);
				});

				it('#arr2arr', function()
				{
					var newOptions = optionsUtils.extend();
					expect(newOptions.codeModifyItems.I18NHandlerAlias).to.be(true);
					newOptions = optionsUtils.extend({codeModifiedArea: []});
					expect(newOptions.codeModifyItems.I18NHandlerAlias).to.be(undefined);
					newOptions = optionsUtils.extend({codeModifiedArea: ['I18NHandlerAlias']});
					expect(newOptions.codeModifyItems.I18NHandlerAlias).to.be(true);
				});
			});
		});

		it('#I18NhandlerTpl', function()
		{
			var code = require('../files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(code,
				{
					I18NhandlerTpl_GetGlobalCode: 'window.settings',
					I18NhandlerTpl_LanguageVarName: '_lan_'
				});
			var otherCode = requireAfterWrite('func_code_noi18n_new_style.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		describe('#isMinFuncTranslateCode', function()
		{
			var code = require('../files/casefile/func_code/func_code_noi18n').toString();
			it('#true', function()
			{
				var info = i18nc(code,
				{
					isMinFuncTranslateCode: true
				});

				var info2 = i18nc(code,
				{
					minTranslateFuncCode: 'all'
				});

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(info2.code));
			});

			it('#false', function()
			{
				var info = i18nc(code,
				{
					isMinFuncTranslateCode: false
				});

				var info2 = i18nc(code,
				{
					minTranslateFuncCode: 'onlyFunc'
				});

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(info2.code));
			});
		});
	});
});

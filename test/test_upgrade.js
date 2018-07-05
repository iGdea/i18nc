'use strict';

var expect = require('expect.js');
var autoTestUtils = require('./auto_test_utils');
var requireAfterWrite = autoTestUtils.requireAfterWrite('upgrade');
var i18nc = require('../');

describe('#upgrade', function()
{
	describe('#options', function()
	{
		it('#rename', function()
		{
			var code = require('./files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(code,
				{
					handlerName: 'oldI18N',
					cutWordReg: /中/g,
				});
			var otherCode = requireAfterWrite('func_code_noi18n_rename.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#new style', function()
		{
			var code = require('./files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(code,
				{
					I18NhandlerTpl_GetGlobalCode: 'window.settings',
					I18NhandlerTpl_LanguageVarName: '_lan_'
				});
			var otherCode = requireAfterWrite('func_code_noi18n_new_style.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});
});

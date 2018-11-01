'use strict';

var expect				= require('expect.js');
var i18nc				= require('../../');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('i18n_alias');


describe('#I18N_handler_alias', function()
{
	it('#update', function()
	{
		var code = require('../files/casefile/func_code/func_code_i18n').toString();
		var info = i18nc(code,
			{
				I18NHandlerName: 'I18NNew',
				I18NHandlerAlias: ['I18N'],
			});

		var otherContent = requireAfterWrite('i18n_alias_update.js', info.code);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherContent));
	});

	describe('#update', function()
	{
		it('#alias & new words', function()
		{
			var code = require('../files/casefile/func_code/func_code_i18n').toString();
			var info = i18nc(code,
				{
					I18NHandlerName: 'I18NNew',
					I18NHandlerAlias: ['I18N'],
					codeModifiedArea: ['I18NHandler', 'TranslateWord'],
				});

			var otherContent = requireAfterWrite('i18n_alias_no_update.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherContent));
		});

		it('#only alias', function()
		{
			var code = require('../files/casefile/func_code/func_code_i18n_all').toString();
			var info = i18nc(code,
				{
					I18NHandlerName: 'I18NNew',
					I18NHandlerAlias: ['I18N'],
					codeModifiedArea: ['I18NHandler', 'TranslateWord'],
				});

			var otherContent = requireAfterWrite('i18n_all_alias_no_update.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherContent));
		});
	});
});

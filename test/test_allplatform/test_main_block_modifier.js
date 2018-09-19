'use strict';

var expect				= require('expect.js');
var i18nc				= require('../../');
var autoTestUtils		= require('../auto_test_utils');
var blockModifierFuncs	= require('../files/casefile/func_code/func_code_block_modifier');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('main_block_modifier');

describe('#main block modifier', function()
{
	describe('#types', function()
	{
		it('#skip_scan', function()
		{
			var code = blockModifierFuncs.skip_scan.toString();
			var info = i18nc(code);

			var outputJSON = requireAfterWrite('skip_scan.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('skip_scan.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#skip_replace', function()
		{
			var code = blockModifierFuncs.skip_replace.toString();
			var info = i18nc(code);

			var outputJSON = requireAfterWrite('skip_replace.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('skip_replace.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#skip_scan@I18N', function()
		{
			var code = blockModifierFuncs.skip_scan_I18N.toString();
			var info = i18nc(code);

			var outputJSON = requireAfterWrite('skip_scan@I18N.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('skip_scan@I18N.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#skip_replace@I18N', function()
		{
			var code = blockModifierFuncs.skip_replace_I18N.toString();
			var info = i18nc(code);

			var outputJSON = requireAfterWrite('skip_replace@I18N.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('skip_replace@I18N.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});
});

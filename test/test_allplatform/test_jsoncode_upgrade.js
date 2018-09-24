'use strict';

var expect				= require('expect.js');
var i18nc				= require('../../');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('jsoncode_upgrade');

describe('#jsoncode upgrade', function()
{
	describe('#v1', function()
	{
		var code = require('../files/casefile/i18n_handler/i18n_handler_jsoncode_v1').toString();
		it('#complete', function()
		{
			var info = i18nc(code);
			var outputJSON = requireAfterWrite('v1_complete.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('v1_complete.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#partial', function()
		{
			var info = i18nc(code,
				{
					I18NHandler:
					{
						upgrade: {checkVersion: false}
					}
				});
			var outputJSON = requireAfterWrite('v1_partial.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('v1_partial.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});
});

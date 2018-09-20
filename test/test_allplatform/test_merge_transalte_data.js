'use strict';

var expect				= require('expect.js');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('merge_translate_data');
var mergeTranslateData	= require('../../lib/i18n_func/lib/merge_translate_data');


describe('#mergeTranslateData', function()
{
	it('#base', function()
	{
		var args = require('../files/merge_translate_data');
		var result = mergeTranslateData(args);

		var outputJSON = requireAfterWrite('merge_translate_data.json', result);

		expect(result).to.eql(outputJSON);
	});
});

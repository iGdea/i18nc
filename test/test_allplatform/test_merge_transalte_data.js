'use strict';

var expect				= require('expect.js');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('merge_translate_data');
var mergeTranslateData	= require('../../lib/i18n_func/merge_translate_data');
var mergeArgsData		= require('../files/merge_translate_data');


describe('#mergeTranslateData', function()
{
	it('#base', function()
	{
		var result = mergeTranslateData(mergeArgsData);
		var outputJSON = requireAfterWrite('merge_translate_data.json', result);
		expect(result).to.eql(outputJSON);
	});

	it('#merge_data', function()
	{
		var result = mergeTranslateData._mergeData(mergeArgsData);
		var outputJSON = requireAfterWrite('merge_data.json', result);
		expect(result).to.eql(outputJSON);
	});
});

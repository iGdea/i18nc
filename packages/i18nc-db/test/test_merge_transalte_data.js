'use strict';

var expect				= require('expect.js');
var testReq				= require('i18nc-test-req');
var requireAfterWrite	= testReq('merge_translate_data');
var mergeTranslateData	= require('../lib/merge_translate_data');
var mergeArgsData		= require('./files/merge_translate_data.json');
testReq.ROOT_PATH		= __dirname + '/files/output';


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

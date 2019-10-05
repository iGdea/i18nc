'use strict';

var fs                = require('fs');
var expect            = require('expect.js');
var i18ncPO           = require('../');
var autoTestUtils     = require('./auto_test_utils');
var requireAfterWrite = autoTestUtils.requireAfterWrite('output_parse');

describe('#parse', function()
{
	it('#base', function()
	{
		var json = i18ncPO.parse(fs.readFileSync(__dirname+'/files/input.po').toString());
		var otherJson = requireAfterWrite('translate_data.json', JSON.stringify(json, null, '\t'));
		expect(json).to.eql(otherJson);
	});
});

'use strict';

const fs = require('fs');
const expect = require('expect.js');
const i18ncPO = require('../');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('output_parse');

describe('#parse', function() {
	it('#base', function() {
		const json = i18ncPO.parse(
			fs.readFileSync(__dirname + '/files/input.po').toString()
		);
		const otherJson = requireAfterWrite(
			'translate_data.json',
			JSON.stringify(json, null, '\t')
		);
		expect(json).to.eql(otherJson);
	});
});

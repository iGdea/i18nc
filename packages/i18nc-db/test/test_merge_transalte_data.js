'use strict';

const expect = require('expect.js');
const testReq = require('i18nc-test-req');
const requireAfterWrite = testReq('merge_translate_data');
const mergeTranslateData = require('../lib/merge_translate_data');
const mergeArgsData = require('./files/merge_translate_data.json');
testReq.ROOT_PATH = __dirname + '/files/output';

describe('#mergeTranslateData', function() {
	it('#base', function() {
		const result = mergeTranslateData(mergeArgsData);
		const outputJSON = requireAfterWrite('merge_translate_data.json', result);
		expect(result).to.eql(outputJSON);
	});

	it('#merge_data', function() {
		const result = mergeTranslateData._mergeData(mergeArgsData);
		const outputJSON = requireAfterWrite('merge_data.json', result);
		expect(result).to.eql(outputJSON);
	});
});

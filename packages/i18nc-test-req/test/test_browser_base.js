'use strict';

const expect = require('expect.js');
const testReq = require('../');
const checkResult = require('./check_result');
testReq.ROOT_PATH = __dirname + '/output';

describe('#base', function() {
	it('#require', function() {
		const requireAfterWrite = testReq('base');
		expect(requireAfterWrite('base.json')).to.eql({ data: 1 });
	});

	describe('#check', function() {
		beforeEach(function() {
			testReq.BUILD = false;
		});
		afterEach(function() {
			testReq.BUILD = false;
		});

		checkResult('base');
	});
});

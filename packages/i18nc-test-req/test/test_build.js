'use strict';

const testReq = require('../');
const checkResult = require('./check_result');
testReq.ROOT_PATH = __dirname + '/output';

describe('#build', function() {
	beforeEach(function() {
		testReq.BUILD = true;
	});
	afterEach(function() {
		testReq.BUILD = false;
	});

	checkResult('tmp');
});

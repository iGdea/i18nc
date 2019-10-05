'use strict';

var testReq			= require('../');
var checkResult		= require('./check_result');
testReq.ROOT_PATH	= __dirname + '/output';

describe('#build', function()
{
	beforeEach(function()
	{
		testReq.BUILD = true;
	});
	afterEach(function()
	{
		testReq.BUILD = false;
	});

	checkResult('tmp');
});

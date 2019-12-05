'use strict';

var window = global.window = {};
var handler = require('./tmp/input.js');
var expect = require('expect.js');

describe('#base', function()
{
	beforeEach(function()
	{
		window.__i18n_lan__ = 'en-US';
	});

	afterEach(function()
	{
		delete window.__i18n_lan__;
	});

	it('#run', function()
	{
		expect(handler()).to.be('zh');
	});
});

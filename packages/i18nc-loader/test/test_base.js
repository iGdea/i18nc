'use strict';

const window = (global.window = {});
const handler = require('./tmp/input.js');
const expect = require('expect.js');

describe('#base', function() {
	beforeEach(function() {
		window.__i18n_lan__ = 'en-US';
	});

	afterEach(function() {
		delete window.__i18n_lan__;
	});

	it('#run', function() {
		expect(handler()).to.be('zh');
	});
});

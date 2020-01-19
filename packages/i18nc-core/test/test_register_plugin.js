'use strict';

const expect = require('expect.js');
const i18nc = require('../');

describe('#register_plugin', function() {
	it('#base', function() {
		i18nc.registerPlugin('test', function(i18nc, settings, enabled) {
			enabled.test = true;
			settings.testVar = 'test file';
			i18nc.on('newTranslateJSON', function() {});
		});

		expect(i18nc.plugins.test).to.be.a('function');
		expect(i18nc.defaults.pluginSettings.testVar).to.be('test file');
		expect(i18nc.defaults.pluginEnabled.test).to.be(true);
	});
});

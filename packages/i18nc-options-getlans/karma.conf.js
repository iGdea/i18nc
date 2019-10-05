'use strict';

var commonConfig = require('karma-config-brcjs');

module.exports = function(config)
{
	commonConfig(config, require('./package.json'));

	config.set(
	{
		basePath: 'test/',
		files: ['browser/test_*.js'],
		preprocessors: {'browser/test_*.js': ['browserify']},
	});
};

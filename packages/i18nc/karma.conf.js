'use strict';

var commonConfig = require('karma-config-brcjs');

module.exports = function(config)
{
	commonConfig(config, require('./package.json'));

	config.set(
	{
		files: ['browser/test_*.js'],
		preprocessors: {'browser/test_*.js': ['browserify']},
	});
};

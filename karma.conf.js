'use strict';

var commonConfig = require('karma-config-brcjs');

module.exports = function(config)
{
	commonConfig(config);

	config.set(
	{
		files: ['test_*.js'],
		preprocessors: {'test_*.js': ['browserify']},
	});
};

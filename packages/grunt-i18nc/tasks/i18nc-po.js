'use strict';

var i18nc = require('i18nc');
var i18ncTask = require('../lib/i18nc');

module.exports = function(grunt)
{
	grunt.registerMultiTask('i18nc-po', 'Create i18nc po files.', function()
	{
		var outputDir = this.data.output;
		var options = this.options(
			{
				clearWordsAfterOutput: false
			});

		if (!outputDir) return;

		var done = this.async();
		i18nc.util.file.mulitResult2POFiles(i18ncTask.data, outputDir, options)
			.then(function()
			{
				if (options.clearWordsAfterOutput)
				{
					i18ncTask.data = {};
				}
				done();
			},
			done);
	});
};

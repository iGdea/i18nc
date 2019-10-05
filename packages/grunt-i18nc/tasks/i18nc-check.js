'use strict';

var check = require('../lib/check').handler;

module.exports = function(grunt)
{
	grunt.registerMultiTask('i18nc-check', 'Check I18N handler wrapped stauts of JS files.', function()
	{
		var self = this;
		var options = self.options({});
		var checkFailNum = 0;

		self.files.forEach(function(file)
		{
			var srcFile = file.src[0];
			var content = grunt.file.read(srcFile).toString();

			if (check(srcFile, content, options) === false) checkFailNum++;
		});

		var checkSucNumStr = ''+(this.files.length - checkFailNum);
		var checkFailNumStr = ''+checkFailNum;
		grunt.log.writeln('Check File Result, Suc: %s,  Fail: %s', checkSucNumStr.green, checkFailNumStr.red);

		if (checkFailNum) throw new Error('Check Wrap Fail');
	});
};

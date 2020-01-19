'use strict';

const check = require('../lib/check').handler;

module.exports = function(grunt) {
	grunt.registerMultiTask(
		'i18nc-check',
		'Check I18N handler wrapped stauts of JS files.',
		function() {
			const self = this;
			const options = self.options({});
			let checkFailNum = 0;

			self.files.forEach(function(file) {
				const srcFile = file.src[0];
				const content = grunt.file.read(srcFile).toString();

				if (check(srcFile, content, options) === false) checkFailNum++;
			});

			const checkSucNumStr = '' + (this.files.length - checkFailNum);
			const checkFailNumStr = '' + checkFailNum;
			grunt.log.writeln(
				'Check File Result, Suc: %s,  Fail: %s',
				checkSucNumStr.green,
				checkFailNumStr.red
			);

			if (checkFailNum) throw new Error('Check Wrap Fail');
		}
	);
};

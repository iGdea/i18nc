'use strict';

const log = require('../lib/log');
const i18ncTask = require('../lib/i18nc').handler;
const Promise = require('bluebird');

module.exports = function(grunt) {
	grunt.registerMultiTask(
		'i18nc',
		'Wrap I18N handler for JS files.',
		function() {
			const self = this;
			const options = self.options({
				poFilesInputDir: null,
				isHoldError: true
			});
			const done = self.async();
			const errorArr = [];
			const files = self.files;

			return Promise.map(
				files,
				function(file) {
					const srcFile = file.src[0];
					const content = grunt.file.read(srcFile).toString();
					return i18ncTask(file.orig.cwd, srcFile, content, options)
						.then(function(code) {
							grunt.file.write(file.dest, code);
						})
						.catch(function(err) {
							if (options.isHoldError) {
								log.error(
									'parse file error:%s err:%s',
									srcFile,
									err.message
								);
								log.verbose.error(err.stack);
								errorArr.push({
									file: srcFile,
									error: err
								});
							} else {
								log.error('Error File:%s', srcFile);
								throw err;
							}
						});
				},
				{
					concurrency: 5
				}
			)
				.then(function() {
					if (errorArr.length) {
						log.error('[Error File List]');
						errorArr.forEach(function(item) {
							log.error(
								'File:%s\n Error Message:%s',
								item.file,
								item.error.message
							);
						});
					}

					const checkSucNumStr = '' + (files.length - errorArr.length);
					const checkFailNumStr = '' + errorArr.length;
					log.writeln(
						'Create File Result, Suc: %s,  Fail: %s',
						checkSucNumStr.green,
						checkFailNumStr[errorArr.length ? 'red' : 'green']
					);

					if (errorArr.length) throw new Error('Some file Is Error');
				})
				.then(done, done);
		}
	);
};

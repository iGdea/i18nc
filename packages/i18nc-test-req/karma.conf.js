'use strict';

const glob = require('glob');
const commonConfig = require('karma-config-brcjs');

module.exports = function(config) {
	commonConfig(config, require('./package.json'));

	const files = [].concat(
		glob.sync('output/**', { cwd: __dirname + '/test/', nodir: true })
	);

	config.set({
		basePath: 'test/',
		files: ['test_browser_*.js'],
		preprocessors: { 'test_browser_*.js': ['browserify'] },
		browserify: {
			debug: true,
			// 针对使用var形式引入的文件，提前打包进去
			// 不能直接使用file, __dirname 是相对于basedir的，而require生成的路径是绝对路径
			// 不能使用exposeAll，karma也会用外部require的方式引入执行文件，用的是绝对路径
			// exposeAll: true,
			require: [
				files.map(function(file) {
					// 这样处理之后，打包到文件中的路径key，就是相对basedir
					return { file: __dirname + '/test/' + file, expose: true };
				})
			]
			// require: files.map(function(file){return __dirname+'/test/'+file}),
		}
	});
};

'use strict';

var commonConfig = require('karma-config-brcjs');
var glob = require('glob');

module.exports = function(config)
{
	commonConfig(config);

	var files = [];
	files = files.concat(glob.sync('files/output/**', {cwd: __dirname+'/test/', nodir: true}));
	files = files.concat(glob.sync('example/**', {cwd: __dirname+'/test/', nodir: true}));

	config.set(
	{
		pkg: require('./package.json'),
		files: ['test_*.js'],
		preprocessors: {'test_*.js': ['browserify']},
		browserify:
		{
			debug: true,
			// 针对使用var形式引入的文件，提前打包进去
			// 不能直接使用file, __dirname 是相对于basedir的，而require生成的路径是绝对路径
			// 不能使用exposeAll，karma也会用外部require的方式引入执行文件，用的是绝对路径
			// exposeAll: true,
			require: [
				files.map(function(file)
				{
					// 这样处理之后，打包到文件中的路径key，就是相对basedir
					return {file: __dirname+'/test/'+file, expose: true};
				})
			],
			// require: files.map(function(file){return __dirname+'/test/'+file}),
		}
	});
};

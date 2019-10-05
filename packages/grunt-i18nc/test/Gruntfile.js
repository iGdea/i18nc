'use strict';

module.exports = function(grunt)
{
	grunt.initConfig(
	{
		i18nc:
		{
			options:
			{
				dbTranslateWords: require('./files/translate_data.json'),
			},
			test:
			{
				src: '*.js',
				cwd: 'files/',
				dest: 'tmp/',
				filter: 'isFile',
				expand: true
			}
		},
		'i18nc-po':
		{
			options:
			{
				pickFileLanguages: ['en-US', 'zh-TW']
			},
			test:
			{
				output: __dirname+'/tmp/'
			}
		},
		'i18nc-check':
		{
			test:
			{
				src: '*.js',
				cwd: 'files/',
				dest: 'tmp/',
				filter: 'isFile',
				expand: true
			}
		},
	});

	grunt.loadTasks('../tasks');
	grunt.registerTask('default', ['i18nc', 'i18nc-po', 'i18nc-check']);
};

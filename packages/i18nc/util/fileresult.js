'use strict';

var Promise = require('bluebird');
var _       = require('lodash');
var fs      = Promise.promisifyAll(require('fs'));
var mkdirp  = Promise.promisify(require('mkdirp'));
var debug   = require('debug')('i18nc:fileresult');
var i18ncPO = require('i18nc-po');


exports.mulitResult2POFiles = mulitResult2POFiles;

/**
 * 将很多个文件解析的结果，打包成一组po文件
 * data的格式为 {filepath: <i18nc ret>}
 */
function mulitResult2POFiles(data, outputDir, options)
{
	if (!options) options = {};
	var subScopeDatas = _.values(data);
	if (!subScopeDatas || !subScopeDatas.length)
	{
		return Promise.resolve();
	}
	var CodeInfoResult = subScopeDatas[0].constructor;
	var result = new CodeInfoResult({subScopeDatas: subScopeDatas});
	var output = i18ncPO.create(result,
		{
			title: options.poFileTitle,
			email: options.poFileEmail,
			existedTranslateFilter: options.existedTranslateFilter,
			onlyTheseLanguages: options.I18NHandler
				&& options.I18NHandler.data
				&& options.I18NHandler.data.onlyTheseLanguages,
		});
	debug('output:%o', output);

	return mkdirp(outputDir)
		.then(function()
		{
			var poPromises = Promise.map(_.keys(output.po), function(lan)
				{
					var file = outputDir+'/'+lan+'.po';
					return fs.writeFileAsync(file, output.po[lan]);
				},
				{
					concurrency: 5
				});

			return Promise.all(
				[
					fs.writeFileAsync(outputDir+'/lans.pot', output.pot),
					poPromises
				]);
		});
}

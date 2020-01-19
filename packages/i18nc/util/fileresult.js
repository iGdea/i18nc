'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));
const mkdirp = Promise.promisify(require('mkdirp'));
const debug = require('debug')('i18nc:fileresult');
const i18ncPO = require('i18nc-po');

exports.mulitResult2POFiles = mulitResult2POFiles;

/**
 * 将很多个文件解析的结果，打包成一组po文件
 * data的格式为 {filepath: <i18nc ret>}
 */
function mulitResult2POFiles(data, outputDir, options) {
	if (!options) options = {};
	const subScopeDatas = _.values(data);
	if (!subScopeDatas || !subScopeDatas.length) {
		return Promise.resolve();
	}
	const CodeInfoResult = subScopeDatas[0].constructor;
	const result = new CodeInfoResult({ subScopeDatas: subScopeDatas });
	const output = i18ncPO.create(result, {
		title: options.poFileTitle,
		email: options.poFileEmail,
		existedTranslateFilter: options.existedTranslateFilter,
		onlyTheseLanguages:
			options.I18NHandler &&
			options.I18NHandler.data &&
			options.I18NHandler.data.onlyTheseLanguages
	});
	debug('output:%o', output);

	return mkdirp(outputDir).then(function() {
		const poPromises = Promise.map(
			_.keys(output.po),
			function(lan) {
				const file = outputDir + '/' + lan + '.po';
				return fs.writeFileAsync(file, output.po[lan]);
			},
			{
				concurrency: 5
			}
		);

		return Promise.all([
			fs.writeFileAsync(outputDir + '/lans.pot', output.pot),
			poPromises
		]);
	});
}

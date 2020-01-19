'use strict';

const Promise = require('bluebird');
const debug = require('debug')('i18nc');
const fs = Promise.promisifyAll(require('fs'));
const mkdirp = Promise.promisify(require('mkdirp'));
const path = require('path');
const extend = require('extend');
const cliUtil = require('../cli_util');
const i18ncUtil = require('../../util/index');

module.exports = function code(cwd, input, output, options) {
	let translateDBFile = options.translateDBFile;
	let readTranslateDBFilePromise;

	if (translateDBFile) {
		translateDBFile = path.resolve(cwd, translateDBFile);
		debug('read translateDBFile:%s', translateDBFile);

		readTranslateDBFilePromise = fs
			.readFileAsync(translateDBFile, {
				encoding: 'utf8'
			})
			.then(function(data) {
				return JSON.parse(data);
			});
	}

	const allfiledata = {};

	return Promise.all([
		cliUtil.scanFileList(path.resolve(cwd, input), null, options.isRecurse),
		readTranslateDBFilePromise,
		options.inputPOFile &&
			i18ncUtil.loadPOFile(path.resolve(cwd, options.inputPOFile)),
		options.inputPODir &&
			i18ncUtil.autoLoadPOFiles(path.resolve(cwd, options.inputPODir))
	])
		.then(function(data) {
			const fileInfo = data[0];
			const dbTranslateWords = extend(true, {}, data[2], data[3], data[1]);
			const myOptions = {
				dbTranslateWords: dbTranslateWords,
				I18NHandlerName: options.I18NHandlerName,
				I18NHandlerAlias: options.I18NHandlerAlias,
				ignoreScanHandlerNames: options.ignoreScanHandlerNames,
				codeModifyItems: options.codeModifyItems,
				I18NHandler: {
					data: { onlyTheseLanguages: options.onlyTheseLanguages },
					style: { minFuncCode: options.minTranslateFuncCode },
					upgrade: { partial: options.isPartialUpdate },
					insert: {
						checkClosure: options.isCheckClosureForNewI18NHandler
					}
				}
			};

			if (fileInfo.type == 'list') {
				return Promise.map(
					fileInfo.data,
					function(file) {
						debug('i18n file start: %s', file);

						return cliUtil
							.file2i18nc(file, myOptions)
							.then(function(data) {
								const code = data.code;
								delete data.code;
								allfiledata[file] = data;
								if (options.isOnlyCheck) return;

								const wfile = path.resolve(cwd, output, file);
								debug('writefile: %s', wfile);

								return writeFile(wfile, code).then(function() {
									console.log('write file: ' + wfile);
								});
							});
					},
					{
						concurrency: 5
					}
				);
			} else {
				const file = fileInfo.data;
				debug('one file mod:%s', file);

				return cliUtil.file2i18nc(file, myOptions).then(function(data) {
					const code = data.code;
					delete data.code;

					allfiledata[file] = data;
					if (options.isOnlyCheck) return;

					const wfile = path.resolve(cwd, output);
					debug('writefile: %s', wfile);

					return cliUtil
						.getWriteOneFilePath(wfile, file)
						.then(function(wfile) {
							return fs
								.writeFileAsync(wfile, code)
								.then(function() {
									console.log('write file: ' + wfile);
								});
						});
				});
			}
		})
		.then(function() {
			// 如果仅仅检查，则不处理写的逻辑
			if (options.isOnlyCheck) return;

			let outputWordFile = options.outputWordFile;
			let writeOutputWordFilePromise;
			if (outputWordFile) {
				outputWordFile = path.resolve(cwd, outputWordFile);
				writeOutputWordFilePromise = writeFile(
					outputWordFile,
					JSON.stringify(allfiledata, null, '\t')
				).then(function() {
					console.log('write words file: ' + outputWordFile);
				});
			}

			let outputPODir = options.outputPODir;
			if (outputPODir) outputPODir = path.resolve(cwd, outputPODir);

			return Promise.all([
				writeOutputWordFilePromise,
				outputPODir &&
					i18ncUtil.mulitResult2POFiles(allfiledata, outputPODir, {
						pickFileLanguages: options.pickFileLanguages
					})
			]).then(function() {});
		});
};

function writeFile(file, content) {
	return mkdirp(path.dirname(file)).then(function() {
		return fs.writeFileAsync(file, content);
	});
}

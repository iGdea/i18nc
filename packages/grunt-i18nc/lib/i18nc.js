'use strict';

const path = require('path');
const i18nc = require('i18nc');
const extend = require('extend');
const Promise = require('bluebird');
const log = require('./log');

function toLinux(p) {
	return p && path.normalize(p).replace(/\\/g, '/');
}

function _removeResultCode(json) {
	delete json.code;
	json.subScopeDatas.forEach(_removeResultCode);
}

exports.data = {};
exports.dbloadCache = {};

exports.handler = function(srcCwd, srcFile, content, options) {
	let dbTranslateWords = options.dbTranslateWords || {};

	function main(dbTranslateWords) {
		const pcwd = process.cwd();
		const fullCwd = path.resolve(pcwd, srcCwd);
		const fullSrcFile = path.resolve(pcwd, srcFile);

		log.verbose.writeln('full cwd:%s src:%s', fullCwd, fullSrcFile);

		const opts = extend({}, options, {
			cwd: fullCwd,
			srcFile: toLinux(path.resolve(fullCwd, fullSrcFile)),
			dbTranslateWords: dbTranslateWords
		});

		const info = i18nc(content, opts);
		const dirtyWords = info.allDirtyWords();
		if (dirtyWords.list.length) {
			const output = i18nc.util.cli.printDirtyWords(dirtyWords, 2);
			log.writeln('  File DirtyWords: ' + srcFile);
			log.writeln(output);
		}

		const code = info.code;

		_removeResultCode(info);
		exports.data[fullSrcFile] = info;

		return code;
	}

	const poFilesInputDir = options.poFilesInputDir;
	if (poFilesInputDir) {
		const promise =
			exports.dbloadCache[poFilesInputDir] ||
			(exports.dbloadCache[poFilesInputDir] = i18nc.util.file.loadPOFiles(
				poFilesInputDir
			));
		return promise.then(function(data) {
			dbTranslateWords = extend(true, {}, data, dbTranslateWords);

			return main(dbTranslateWords);
		});
	} else {
		return Promise.resolve(dbTranslateWords).then(main);
	}
};

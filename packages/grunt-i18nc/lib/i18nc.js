'use strict';

var path = require('path');
var i18nc = require('i18nc');
var extend = require('extend');
var Promise = require('bluebird');
var log = require('./log');

function toLinux(p)
{
	return p && path.normalize(p).replace(/\\/g, '/');
}

function _removeResultCode(json)
{
	delete json.code;
	json.subScopeDatas.forEach(_removeResultCode);
}

exports.data = {};
exports.dbloadCache = {};

exports.handler = function(srcCwd, srcFile, content, options)
{
	var dbTranslateWords = options.dbTranslateWords || {};

	function main(dbTranslateWords)
	{
		var pcwd = process.cwd();
		var fullCwd = path.resolve(pcwd, srcCwd);
		var fullSrcFile = path.resolve(pcwd, srcFile);

		log.verbose.writeln('full cwd:%s src:%s', fullCwd, fullSrcFile);

		var opts = extend({}, options,
			{
				cwd					: fullCwd,
				srcFile				: toLinux(path.resolve(fullCwd, fullSrcFile)),
				dbTranslateWords	: dbTranslateWords,
			});

		var info = i18nc(content, opts);
		var dirtyWords = info.allDirtyWords();
		if (dirtyWords.list.length)
		{
			var output = i18nc.util.cli.printDirtyWords(dirtyWords, 2);
			log.writeln('  File DirtyWords: '+srcFile);
			log.writeln(output);
		}

		var code = info.code;

		_removeResultCode(info);
		exports.data[fullSrcFile] = info;

		return code;
	}

	var poFilesInputDir = options.poFilesInputDir;
	if (poFilesInputDir)
	{
		var promise = exports.dbloadCache[poFilesInputDir]
			|| (exports.dbloadCache[poFilesInputDir] = i18nc.util.file.loadPOFiles(poFilesInputDir));
		return promise.then(function(data)
			{
				dbTranslateWords = extend(true, {}, data, dbTranslateWords);

				return main(dbTranslateWords);
			});
	}
	else
	{
		return Promise.resolve(dbTranslateWords).then(main);
	}
}

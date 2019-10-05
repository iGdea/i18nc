'use strict';

var i18nc = require('i18nc');
var log = require('./log');

exports.handler = function(srcFile, content, options)
{
	var json = i18nc(content, options);
	var newlist = json.allCodeTranslateWords().list4nowrappedWordAsts();
	var dirtyWords = json.allDirtyWords();

	if (!newlist.length)
	{
		log.writeln('  %s %s', 'ok'.green, srcFile);
	}
	else
	{
		log.writeln('  %s %s', 'fail'.red, srcFile);
		log.verbose.writeln('newlist:%s dirtyWords:%s', newlist.length, dirtyWords.list.length);
		var output = i18nc.util.cli.printDirtyAndNewWords(dirtyWords, newlist, 7);

		log.writeln(output);

		return false;
	}
}

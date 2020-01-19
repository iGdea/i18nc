'use strict';

const i18nc = require('i18nc');
const log = require('./log');

exports.handler = function(srcFile, content, options) {
	const json = i18nc(content, options);
	const newlist = json.allCodeTranslateWords().list4nowrappedWordAsts();
	const dirtyWords = json.allDirtyWords();

	if (!newlist.length) {
		log.writeln('  %s %s', 'ok'.green, srcFile);
	} else {
		log.writeln('  %s %s', 'fail'.red, srcFile);
		log.verbose.writeln(
			'newlist:%s dirtyWords:%s',
			newlist.length,
			dirtyWords.list.length
		);
		const output = i18nc.util.cli.printDirtyAndNewWords(
			dirtyWords,
			newlist,
			7
		);

		log.writeln(output);

		return false;
	}
};

'use strict';

var Promise    = require('bluebird');
var path       = require('path');
var debug      = require('debug')('i18nc:check');
var cliUtil    = require('../cli_util');
var cliPrinter = require('../../util/cli_printer');

module.exports = function checkWrap(cwd, input, options)
{
	return cliUtil.scanFileList(path.resolve(cwd, input), options.isRecurse)
		.then(function(fileInfo)
		{
			var myOptions =
			{
				I18NHandlerName        : options.I18NHandlerName,
				I18NHandlerAlias       : options.I18NHandlerAlias,
				ignoreScanHandlerNames : options.ignoreScanHandlerNames,
				codeModifyItems        : options.codeModifyItems,
				I18NHandler:
				{
					data: {onlyTheseLanguages: options.onlyTheseLanguages},
					style: {minFuncCode: options.minTranslateFuncCode},
					insert:
					{
						checkClosure: options.isCheckClosureForNewI18NHandler,
					},
				}
			};

			var files = fileInfo.type == 'list' ? fileInfo.data : [fileInfo.data];
			return Promise.map(files, function(file)
				{
					debug('i18n file start: %s', file);

					return cliUtil.file2i18nc(file, myOptions)
						.then(function(result)
						{
							var newlist = result.allCodeTranslateWords().list4newWordAsts();
							var dirtyWords = result.allDirtyWords();
							return {file: file, newlist: newlist, dirtyWords: dirtyWords};
						});
				},
				{
					concurrency: 5
				})
				.then(function(results)
				{
					results.forEach(_printResult);
				});
		});
}


function _printResult(item)
{
	if (!item.newlist.length && !item.dirtyWords.list.length)
	{
		console.log('  '+cliPrinter.colors.green('ok')+' '+item.file);
	}
	else
	{
		console.log('  '+cliPrinter.colors.red('fail')+' '+item.file);
		var output = cliPrinter.printDirtyAndNewWords(item.dirtyWords, item.newlist, 7);

		console.log(output);
	}
}

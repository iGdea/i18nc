'use strict';

var cwd             = process.cwd();
var program         = require('commander');
var cliUtil         = require('./cli_util');
var codeAction      = require('./actions/code');
var checkWrapAction = require('./actions/check-wrap');
var refsAction      = require('./actions/refs');
var cliPrinter      = require('../util/cli_printer');

var COMMAND_INDENT = '\n'+new Array(42).join(' ');
module.exports = program;

program.version(
		' cli: v'+require('../package.json').version
		+ '\ncore: v'+require('../').version
	);

program.command('code <input> <output>')
	.description('Warp code width I18N handler.')
	.option('-d --input-po-dir [dir]', 'Input po files dir')
	.option('   --input-po-file [file]', 'Input po files file')
	.option('   --translate-db-file [file]', 'Translate data db file')
	.option('-o --output-po-dir [dir]', 'Output po files dir')
	.option('   --output-word-file [file]', 'Output translate words')
	.option('-l --lans [lan1,lan2]', 'Pick file languages', cliUtil.argsToArray)
	.option('-n --i18n-handler-name [name]', 'Custom I18N handler name')
	.option('   --i18n-handler-alias [name,name]', 'I18N handler alias', cliUtil.argsToArray)
	.option('   --ignore-scan-names [name,name]', 'Ignore cacn handler names', cliUtil.argsToArray)

	.option('   --only-check', 'Only check, not write code to file')
	.option('-r', 'Recurse into directories')
	.option('-w', 'Closure when I18N hanlder insert head')
	.option('-m', 'Min Function translate code of I18N handler')
	.option('-f', ['Force update total I18N Function', 'default: partial update'].join(COMMAND_INDENT)+'\n')

	.option('-c, --color', 'Enable colored output')
	.option('-C, --no-color', 'Disable colored output')

	.option('-t', 'Enable codeModifyItems: TranslateWord')
	.option('-T', 'Disable codeModifyItems: TranslateWord')
	.option('-e', 'Enable codeModifyItems: TranslateWord_RegExp')
	.option('-E', 'Disable codeModifyItems: TranslateWord_RegExp')
	.option('-a', 'Enable codeModifyItems: I18NHandlerAlias')
	.option('-A', 'Disable codeModifyItems: I18NHandlerAlias')
	.action(function(input, output, args)
	{
		var options = cliUtil.key2key(args,
			{
				'input-po-dir'       : 'inputPODir',
				'input-po-file'      : 'inputPOFile',
				'translate-db-file'  : 'translateDBFile',
				'output-po-dir'      : 'outputPODir',
				'output-word-file'   : 'outputWordFile',
				'lans'               : 'onlyTheseLanguages',
				'i18n-hanlder-name'  : 'I18NHandlerName',
				'i18n-hanlder-alias' : 'I18NHandlerAlias',
				'ignore-scan-names'  : 'ignoreScanHandlerNames',
				'only-check'         : 'isOnlyCheck',
				'r'                  : 'isRecurse',
				'c'                  : 'isCheckClosureForNewI18NHandler',
				'm'                  : 'minTranslateFuncCode',
			});

		options.isPartialUpdate = !args.f;

		if (args.color === false) cliPrinter.colors.enabled = false;

		var obj = options.codeModifyItems = {};
		if (args.t) obj.TranslateWord = true;
		if (args.T) obj.TranslateWord = false;
		if (args.e) obj.TranslateWord_RegExp = true;
		if (args.E) obj.TranslateWord_RegExp = false;
		if (args.a) obj.I18NHandlerAlias = true;
		if (args.A) obj.I18NHandlerAlias = false;

		codeAction(cwd, input, output, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('check-wrap <input>')
	.description('Check if all words were wrapped by I18N handler.')
	.option('-n --i18n-handler-name [name]', 'Custom I18N handler name')
	.option('   --i18n-handler-alias [name,name]', 'I18N handler alias', cliUtil.argsToArray)
	.option('   --ignore-scan-names [name,name]', 'Ignore cacn handler names', cliUtil.argsToArray)

	.option('-r', 'Recurse into directories')

	.option('-c, --color', 'Enable colored output')
	.option('-C, --no-color', 'Disable colored output')

	.option('-t', 'Enable codeModifyItems: TranslateWord')
	.option('-T', 'Disable codeModifyItems: TranslateWord')
	.option('-e', 'Enable codeModifyItems: TranslateWord_RegExp')
	.option('-E', 'Disable codeModifyItems: TranslateWord_RegExp')
	.option('-a', 'Enable codeModifyItems: I18NHandlerAlias')
	.option('-A', 'Disable codeModifyItems: I18NHandlerAlias')
	.action(function(input, args)
	{
		var options = cliUtil.key2key(args,
			{
				'i18n-handler-name'  : 'I18NHandlerName',
				'i18n-hanlder-alias' : 'I18NHandlerAlias',
				'ignore-scan-names'  : 'ignoreScanHandlerNames',
				'r'                  : 'isRecurse',
			});

		if (args.color === false) cliPrinter.colors.enabled = false;

		var obj = options.codeModifyItems = {};
		if (args.t) obj.TranslateWord = true;
		if (args.T) obj.TranslateWord = false;
		if (args.e) obj.TranslateWord_RegExp = true;
		if (args.E) obj.TranslateWord_RegExp = false;
		if (args.a) obj.I18NHandlerAlias = true;
		if (args.A) obj.I18NHandlerAlias = false;

		checkWrapAction(cwd, input, options)
			.catch(function(err)
			{
				console.log(err.stack);
			});
	});


program.command('refs <string>')
	.description('Parse refs in po files. <e.g.> "1,1,0,7,subtype,*"')
	.option('-C, --no-color', 'Disable colored output.')
	.action(function(string, args)
	{
		if (args.color === false) cliPrinter.colors.enabled = false;

		try {
			refsAction(string);
		}
		catch(err)
		{
			console.log(err.stack);
		}
	});

program.command('help <cmd>')
	.description('display help for [cmd]')
	.action(function(cmd)
	{
		var self = this;

		var command = findSubCommand(self.parent, cmd);
		if (!command) throw new Error('No Defined Command, '+cmd);

		// command.help();
		// remove help info
		command.outputHelp(function(info)
		{
			return info
				// 删除Options下的help
				.replace(/ +-h, --help [^\n]+\n/, '')
				// 在命令行前加上父节点前缀
				.replace(/Usage: */, 'Usage: '+self.parent.name()+' ')
				// 如果没有多余的Options，就把这一项干掉
				.replace(/ +Options:\s+$/, '')
				+ '\n';
		});
	});


// find sub command
function findSubCommand(program, cmd)
{
	var command;
	program.commands.some(function(item)
	{
		if (item.name() == cmd || item.alias() == cmd)
		{
			command = item;
			return true;
		}
	});

	return command;
}

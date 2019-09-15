'use strict';

var emitter			= require('./emitter');
var astUtil			= require('i18nc-ast').util;
var initOptions		= require('i18nc-options').init;
var ASTCollector	= require('./ast_collector').ASTCollector;


exports.main = function(code, options)
{
	options = initOptions(options);

	var tmpEmitter = emitter.new();

	if (typeof options.events.loadTranslateJSON == 'function')
		tmpEmitter.addListener('loadTranslateJSON', options.events.loadTranslateJSON);
	if (typeof options.events.newTranslateJSON == 'function')
		tmpEmitter.addListener('newTranslateJSON', options.events.newTranslateJSON);
	if (typeof options.events.cutword == 'function')
		tmpEmitter.addListener('cutword', options.events.cutword);

	var result;

	try {
		result = exports.run(code, options);
	}
	catch(err)
	{
		emitter.clear();
		throw err;
	}

	emitter.clear();
	return result;
}


exports.run = function(code, options)
{
	var ast		= astUtil.parse(code);
	// 设置scope type为top，表明是code开始处理的顶层作用区间
	var scope	= new ASTCollector(options).collect(ast, 'top');

	scope = scope.squeeze(options.I18NHandler.insert.priorityDefineHalder, options);

	var startPos = scope.ast.range[0];
	var result;
	if (startPos)
	{
		result = scope.codeAndInfo(code.slice(startPos), code, options);
		result.code = code.slice(0, startPos)+result.code;
	}
	else
	{
		result = scope.codeAndInfo(code, code, options);
	}

	// 对最后的代码，进行整理
	// 换行替换
	if (/\r\n/.test(code))
	{
		result.code = result.code.replace(/\r?\n/g, '\r\n');
	}

	return result;
}

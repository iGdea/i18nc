'use strict';

var emitter			= require('./emitter');
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
var ASTCollector	= require('./ast_collector').ASTCollector;


module.exports = function(code, options)
{
	options = optionsUtils.extend(options);

	var tmpEmitter = emitter.new();

	if (typeof options.loadTranslateJSON == 'function')
		tmpEmitter.addListener('loadTranslateJSON', options.loadTranslateJSON);
	if (typeof options.newTranslateJSON == 'function')
		tmpEmitter.addListener('newTranslateJSON', options.newTranslateJSON);
	if (typeof options.cutWord == 'function')
		tmpEmitter.addListener('cutWord', options.cutWord);

	var result = mainHandler(code, options);
	return result;
}


function mainHandler(code, options)
{
	var ast		= astUtils.parse(code);
	// 设置scope type为top，表明是code开始处理的顶层作用区间
	var scope	= new ASTCollector(options).collect(ast, 'top');

	scope = scope.squeeze(options.isInsertToDefineHalder, options);

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

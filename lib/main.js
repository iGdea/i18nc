var _				= require('lodash');
var debug			= require('debug')('i18nc-core:main');
var emitter			= require('./emitter').emitter;
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
var ASTCollector	= require('./ast_collector').ASTCollector;


module.exports = function(code, options)
{
	options = optionsUtils.extend(options);

	var bindLoadTranslateJSON = typeof options.loadTranslateJSON == 'function';
	var bindNewTranslateJSON = typeof options.newTranslateJSON == 'function';
	var bindCutword = typeof options.cutword == 'function';

	if (bindLoadTranslateJSON)
	{
		emitter.on('loadTranslateJSON', options.loadTranslateJSON);
	}
	if (bindNewTranslateJSON)
	{
		emitter.on('newTranslateJSON', options.newTranslateJSON);
	}
	if (bindCutword)
	{
		emitter.on('cutword', options.cutword);
	}


	var result = mainHandler(code, options);


	if (bindLoadTranslateJSON)
	{
		emitter.removeListener('loadTranslateJSON', options.loadTranslateJSON);
	}
	if (bindNewTranslateJSON)
	{
		emitter.removeListener('newTranslateJSON', options.newTranslateJSON);
	}
	if (bindCutword)
	{
		emitter.removeListener('cutword', options.cutword);
	}


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

'use strict';

const emitter = require('./emitter');
const astUtil = require('i18nc-ast').util;
const initOptions = require('i18nc-options').init;
const ASTCollector = require('./ast_collector').ASTCollector;

exports.main = function(code, options) {
	options = initOptions(options);

	const tmpEmitter = emitter.new();

	if (typeof options.events.loadTranslateJSON == 'function')
		tmpEmitter.addListener(
			'loadTranslateJSON',
			options.events.loadTranslateJSON
		);
	if (typeof options.events.newTranslateJSON == 'function')
		tmpEmitter.addListener(
			'newTranslateJSON',
			options.events.newTranslateJSON
		);
	if (typeof options.events.cutword == 'function')
		tmpEmitter.addListener('cutword', options.events.cutword);

	let result;

	try {
		result = exports.run(code, options);
	} catch (err) {
		emitter.clear();
		throw err;
	}

	emitter.clear();
	return result;
};

exports.run = function(code, options) {
	const ast = astUtil.parse(code);
	// 设置scope type为top，表明是code开始处理的顶层作用区间
	let scope = new ASTCollector(options).collect(ast, 'top');

	scope = scope.squeeze(
		options.I18NHandler.insert.priorityDefineHalder,
		options
	);

	const startPos = scope.ast.range[0];
	let result;
	if (startPos) {
		result = scope.codeAndInfo(code.slice(startPos), code, options);
		result.code = code.slice(0, startPos) + result.code;
	} else {
		result = scope.codeAndInfo(code, code, options);
	}

	// 对最后的代码，进行整理
	// 换行替换
	if (/\r\n/.test(code)) {
		result.code = result.code.replace(/\r?\n/g, '\r\n');
	}

	return result;
};

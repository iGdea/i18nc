'use strict';

var esprima		= require('esprima');
var esmangle	= require('esmangle');
var escodegen	= require('escodegen');
var debug		= require('debug')('i18nc-core:i18nc_func_render');

function tpl2render(code)
{
	// 删掉注释
	var originalCode = code.replace(/\/\/[^\n]+/g, '');
		// .replace(/(\$func_header);?/, '$1\n\t')
		// .replace(/(\$func_footer);?/, '\n\t$1');

	// 对源码进行压缩
	var minCode = exports.min(originalCode)
		.replace(/(\$TRANSLATE_JSON_CODE[;,]?)/, '$1\n\t')
		// 函数体换行
		.replace(/\{/, '{\n\t')
		.replace(/\}([^}]*)$/, '\n}$1');

	var minJsonCodeIndent = '\t';
	var originalJsonCodeIndent = originalCode.match(/(\t+)([^\t]*?)\$TRANSLATE_JSON_CODE/);
	originalJsonCodeIndent = originalJsonCodeIndent ? originalJsonCodeIndent[1] : '';
	var originalGetLanguageCodeIndent = originalCode.match(/(\t+)([^\t]*?)\$getLanguageCode/);
	originalGetLanguageCodeIndent = originalGetLanguageCodeIndent
		? originalGetLanguageCodeIndent[1] : '';
	debug('originalJsonCodeIndent:%d originalGetLanguageCodeIndent:%d',
		originalJsonCodeIndent.length, originalGetLanguageCodeIndent.length);

	return function(data, isMin)
	{
		var code = isMin ? minCode : originalCode;
		var codeIndent = isMin ? minJsonCodeIndent : originalJsonCodeIndent;

		return code.replace(/\$(\w+)/g, function(all, key)
		{
			var val = data[key];
			if (!val) return '';

			if (key == 'TRANSLATE_JSON_CODE')
			{
				val = val.split(/\n\r?/).join('\n'+codeIndent);
			}
			else if (!isMin && key == 'getLanguageCode')
			{
				val = val.split(/\n\r?/).join('\n'+originalGetLanguageCodeIndent);
			}

			return val;
		});
	};
}

exports.min = function(code)
{
	var ast = esprima.parse(code);
	var result = esmangle.mangle(ast);

	return escodegen.generate(result,
	{
		format:
		{
			renumber: true,
			hexadecimal: true,
			escapeless: true,
			compact: true,
			semicolons: false,
			parentheses: false
		}
	});
}

exports.render = tpl2render(require('./tpl/full.js').toString());
exports.renderSimple = tpl2render(require('./tpl/simple.js').toString());
exports.renderGlobal = tpl2render(require('./tpl/global.js').toString());

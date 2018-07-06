'use strict';

var esprima		= require('esprima');
var esmangle	= require('esmangle');
var escodegen	= require('escodegen');
var debug		= require('debug')('i18nc-core:i18nc_func_render');

function tpl2render(code)
{
	var code2;
	// mocha 下
	if (typeof process == 'object'
		&& process.env
		&& process.env.I18NC_CODE_FULL_STYLE == 'true')
	{
		code2 = code;
	}
	else
	{
		// 对源码进行压缩
		code2 = exports.min(code)
			// .replace(/(\$func_header);?/, '$1\n\t')
			// .replace(/(\$func_footer);?/, '\n\t$1')
			.replace(/(\$TRANSLATE_JSON_CODE[;,]?)/, '$1\n\t')
			// 函数体换行
			.replace(/\{/, '{\n\t')
			.replace(/\}([^}]*)$/, '\n}$1');
	}

	var jsonCodeIndent = code2.match(/(\t+)([^\t]*?)\$TRANSLATE_JSON_CODE/);
	jsonCodeIndent = jsonCodeIndent ? jsonCodeIndent[1] : '';
	debug('jsonCodeIndent:%d', jsonCodeIndent.length);

	return function(data)
	{
		return code2.replace(/\$(\w+)/g, function(all, key)
		{
			var val = data[key];
			if (!val) return '';

			if (key == 'TRANSLATE_JSON_CODE')
			{
				val = val.split('\n').join('\n'+jsonCodeIndent);
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

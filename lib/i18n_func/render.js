'use strict';

var fs				= require('fs');
var esprima			= require('esprima');
var esmangle		= require('esmangle');
var escodegen		= require('escodegen');

function tpl2render(filename)
{
	var code = fs.readFileSync(__dirname+'/tpl/'+filename, {encoding: 'utf8'});

	// 对源码进行压缩
	var code2 = exports.min(code)
		// .replace(/(\$func_header);?/, '$1\n\t')
		// .replace(/(\$func_footer);?/, '\n\t$1')
		.replace(/(\$TRANSLATE_JSON_CODE;?)/, '$1\n\t')
		// 函数体换行
		.replace(/\{/, '{\n\t')
		.replace(/\}([^}]*)$/, '\n}$1');

	return function(data)
	{
		return code2.replace(/\$(\w+)/g, function(all, key)
		{
			return data[key] || '';
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

exports.render = tpl2render('full.js');
exports.renderSimple = tpl2render('simple.js');

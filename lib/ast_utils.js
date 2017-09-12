var esprima			= require('esprima');
var escodegen		= require('escodegen');
var debug			= require('debug')('i18nc-core:ast_utils');
var astTpl			= require('./ast_tpl');
var optionsUtils	= require('./options');

exports.AST_FLAGS = optionsUtils.AST_FLAGS;
exports.setAstFlag = function setAstFlag(ast, flag)
{
	if (!flag || !ast) return;

	var flag2 = ast.__i18n_flag__ || 0;
	ast.__i18n_flag__ = flag2 | flag;
};

exports.checkAstFlag = function checkAstFlag(ast, flag)
{
	return ast && flag && ast.__i18n_flag__ && (ast.__i18n_flag__ & flag);
};



exports.parse = function parse(code)
{
	return esprima.parse(code, optionsUtils.esprimaOptions);
}

exports.mincode = function mincode(code)
{
	return escodegen.generate(exports.parse(code), optionsUtils.escodegenMinOptions);
}


exports.codeIndent = function(ast, code)
{
	var indent = code.slice(0, ast.range[0])
			.split('\n')
			.pop()
			.match(/^\s*/)[0];

	return indent || '';
}




exports.getI18NLiteral = function getI18NLiteral(ast, handlerName)
{
	if (ast.type == 'CallExpression'
		&& ast.callee && ast.callee.name == handlerName)
	{
		var arg0ast = ast.arguments && ast.arguments[0];
		return arg0ast && arg0ast.type == 'Literal' && arg0ast.value;
	}
}


exports.ast2constVal = function ast2constVal(ast)
{
	if (ast.type == 'Literal') return ast.value;
	// Identifier 是 object的key不是字符串的时候的表示
	// @see #i18n_function_parser #translateSubtreeAst2json #is js, not json
	if (ast.type == 'Identifier') return ast.name;
}

exports.constVal2ast = function constVal2ast(val)
{
	if (!val)
	{
		if (val === undefined)
		{
			return {
                "type": "Identifier",
                "name": "undefined"
            };
		}
		else if (isNaN(val))
		{
			return {
                "type": "Identifier",
                "name": "NaN"
            };
		}
		else
		{
			return {
				"type": "Literal",
				"value": val
			};
		}
	}
	else
	{
		return {
			"type": "Literal",
			"value": val
		};
	}
};

// 获取ast的位置
// 一般用于日志输出
exports.getAstLocStr = function getAstLocStr(ast)
{
	if (ast && ast.loc)
		return ' Loc:'+ast.loc.start.line+','+ast.loc.start.column;
	else
		return '';
};

// 将astArr结果，加上“+”运算
exports.asts2plusExpression = function asts2plusExpression(asts, extFlags)
{
	var len = asts && asts.length;
	if (!len) return;
	if (len == 1) return asts[0];

	var result = asts[0];
	for(var i = 1; i < len; i++)
	{
		var item = asts[i];
		// 遇到数组，就稍微递归一下
		if (Array.isArray(item))
		{
			item = exports.asts2plusExpression(item);
		}

		result = astTpl.BinaryExpression(result, item);
		if (extFlags) exports.setAstFlag(result, extFlags);
	}

	return result;
};

// 将astArr结果，加上“||”运算
// 注意：数组顺序和astArr是相反的
exports.asts2orExpression = function asts2orExpression(asts)
{
	var len = asts && asts.length;
	if (!len) return;
	if (len == 1) return asts[0];

	var result = asts[--len];
	while(len--)
	{
		result = astTpl.LogicalExpression(result, asts[len]);
	}

	return result;
};

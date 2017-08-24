var debug			= require('debug')('i18nc:ast_utils');
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





exports.getConstValueFromAst = function getConstValueFromAst(ast)
{
	if (ast.type == 'Literal') return ''+ast.value;
	if (ast.type == 'Identifier') return ast.name;
}

exports.constVal2ast = function constVal2ast(val)
{
	if (!val)
	{
		return {
			"type": "Literal",
			"value": "",
		};
	}
	else
	{
		return {
			"type": "Literal",
			"value": ""+val,
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
exports.asts2plusExpression = function asts2plusExpression(asts)
{
	var len = asts && asts.length;
	if (!len) return;
	if (len == 1) return asts[0];

	var result = asts[0];
	for(var i = 1; i < len; i++)
	{
		result = astTpl.BinaryExpression(result, asts[i]);
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

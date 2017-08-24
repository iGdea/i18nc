var optionsUtils = require('./options');
var debug = require('debug')('i18nc:ast_utils');

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



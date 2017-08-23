var optionsUtils = require('./options');
var debug = require('debug')('i18nc:ast_utils');

exports.getConstValueFromAst = function getConstValueFromAst(ast)
{
	if (ast.type == 'Literal') return ast.value;
	if (ast.type == 'Identifier') return ast.name;
}


exports.PropertyAst = function PropertyAst(name, valueAst)
{
	return {
		"type": "Property",
		"key":
		{
			"type": "Literal",
			"value": name,
		},
		"computed": false,
		"value": valueAst,
		"kind": "init",
		"method": false,
		"shorthand": false
	}
};

exports.LogicalExpressionAst = function LogicalExpressionAst(leftAst, rightAst)
{
	return {
		"type": "LogicalExpression",
		"operator": "||",
		"left": leftAst,
		"right": rightAst
	};
};


exports.ObjectExpressionAst = function ObjectExpressionAst(propertiesAst)
{
	return {
		"type": "ObjectExpression",
		"properties": propertiesAst
	};
};

exports.constVal2ast = function constVal2ast(val)
{
	if (!val && val !== 0)
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


exports.CallExpressionAst = function CallExpressionAst(name, argumentsAst)
{
	return {
		"type": "CallExpression",
		"callee":
		{
			"type": "Identifier",
			"name": name
		},
		"arguments": argumentsAst
	};
};

exports.ArrayExpressionAst = function ArrayExpressionAst(elementsAst)
{
	return {
		"type": "ArrayExpression",
		"elements": elementsAst
	};
};

exports.LiteralAst = function LiteralAst(val)
{
	return {
		"type": "Literal",
		"value": val
	};
};

exports.BinaryExpressionAst = function BinaryExpressionAst(leftAst, rightAst)
{
	return {
		"type": "BinaryExpression",
		"operator": "+",
		"left": leftAst,
		"right": rightAst
	};
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



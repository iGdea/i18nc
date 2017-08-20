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

exports.constVal2astWidthArray = function constVal2astWidthArray(val)
{
	var type = typeof val;
	if (type == 'string' && !val)
	{
		return {
			"type": "ArrayExpression",
			"elements": []
		};
	}
	else if (type == 'undefined')
	{
		return {
			"type": "Literal",
			"value": '',
		};
	}
	else if (type != 'object')
	{
		return {
			"type": "Literal",
			"value": val,
		};
	}
	else
	{
		debug('ignore constval type: %o, val:%s', type, val);
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

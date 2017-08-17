exports.getConstValueFromAst = function getConstValueFromAst(ast)
{
	if (ast.type == 'Literal') return ast.value;
	if (ast.type == 'Identifier') return ast.name;
}


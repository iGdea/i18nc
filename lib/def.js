'use strict';

var AST_FLAGS = require('i18nc-ast').AST_FLAGS;

exports.BLOCK_MODIFIER =
{
	SKIP_SACN		: '[i18nc] skip_scan',
	SKIP_REPLACE	: '[i18nc] skip_replace',
};

exports.UNSUPPORT_AST_TYPS	=
{
	ObjectKey					: AST_FLAGS.OBJECT_KEY,
	JSXElement					: AST_FLAGS.JSX_ELEMENT,
	TemplateLiteral				: AST_FLAGS.TEMPLATE_LITERAL,
	TaggedTemplateExpression	: AST_FLAGS.TAGGED_TEMPLATE_LITERAL,
};


exports.I18NFunctionVersion = 'G';
exports.I18NFunctionSubVersion =
{
	FULL	: 'f',
	SIMPLE	: 's',
	GLOBAL	: 'g',
};

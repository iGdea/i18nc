'use strict';

exports.BLOCK_MODIFIER =
{
	SKIP_SACN		: '[i18nc] skip_scan',
	SKIP_REPLACE	: '[i18nc] skip_replace',
};

var AST_FLAGS = exports.AST_FLAGS =
{
	SKIP_SACN				: 1 << 0,
	SKIP_REPLACE			: 1 << 1,
	SELF_CREATED			: 1 << 2,
	DIS_REPLACE				: 1 << 3,
	BLOCK_MODIFIER			: 1 << 4,
	I18N_ALIAS				: 1 << 5,
	OBJECT_KEY				: 1 << 6,
	TEMPLATE_LITERAL		: 1 << 7,
	JSX_ELEMENT				: 1 << 8,
	TAGGED_TEMPLATE_LITERAL	: 1 << 9,
	PLACEHOLDER_WORD		: 1 << 10,
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

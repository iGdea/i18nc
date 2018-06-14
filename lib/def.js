'use strict';

exports.BLOCK_MODIFIER =
{
	SKIP_SACN		: '[i18nc] skip_scan',
	SKIP_REPLACE	: '[i18nc] skip_repalce',
};

exports.AST_FLAGS =
{
	SKIP_SACN				: 1 << 0,
	SKIP_REPLACE			: 1 << 1,
	SELF_CREATED			: 1 << 2,
	DIS_REPLACE				: 1 << 3,
	BLOCK_MODIFIER			: 1 << 4,
	I18N_ALIAS				: 1 << 5,
	OBJECT_KEY				: 1 << 6,
};

exports.I18NFunctionVersion = "b";
exports.I18NFunctionSubVersion =
{
	SIMPLE: 's'
};

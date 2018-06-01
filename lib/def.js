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
	FROM_SPLICED_LITERAL	: 1 << 4,
	BLOCK_MODIFIER			: 1 << 5,
	I18N_ALIAS				: 1 << 6,
	OBJECT_KEY				: 1 << 7,
};

exports.I18NFunctionVersion = "8";
exports.I18NFunctionSubVersion =
{
	SIMPLE: 's'
};

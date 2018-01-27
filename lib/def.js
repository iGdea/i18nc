exports.BLOCK_MODIFIER =
{
	SKIP_SACN		: '[i18nc] skip_scan',
	SKIP_REPLACE	: '[i18nc] skip_repalce',
	DEFAULT_SUBTYPE	: '[i18nc] default_subtype',
};

exports.AST_FLAGS =
{
	SKIP_SACN				: 1 << 0,
	SKIP_REPLACE			: 1 << 1,
	SELF_CREATED			: 1 << 2,
	DIS_REPLACE				: 1 << 3,
	FROM_SPLICED_LITERAL	: 1 << 4,
	VALID_I18N				: 1 << 5,
	BLOCK_MODIFIER			: 1 << 6,
};

exports.I18NFunctionVersion = "3";
exports.I18NFunctionSubVersion =
{
	SIMPLE: 's'
};


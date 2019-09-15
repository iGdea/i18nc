exports.skip_scan = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_scan"
		var v2 = "跳过这个中文skip_scan";
	}
};


exports.skip_replace = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_replace"
		var v2 = "这个中文还在skip_replace";
	}
};

exports.skip_scan_I18N = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_scan@I18N"
		var v2 = "跳过这个中文skip_scan@I18N";
	}

	{
		"[i18nc] skip_scan@I18N2"
		var v2 = "这个中文还在skip_scan@I18N2";
	}
};

exports.skip_replace_I18N = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_replace@I18N"
		var v2 = "这个中文还在skip_replace@I18N";
	}

	{
		"[i18nc] skip_replace@I18N2"
		var v2 = "这个中文还在skip_replace@I18N2";
	}
};

exports.skip_scan_fail = function code()
{
	var v1 = '中文';

	"[i18nc] skip_scan"
	var v2 = "跳不过这个中文skip_scan";
};

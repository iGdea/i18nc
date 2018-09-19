exports.skip_scan = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_scan"
		var v2 = "跳过这个中文";
	}
};


exports.skip_replace = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_replace"
		var v2 = "这个中文还在";
	}
};

exports.skip_scan_I18N = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_scan@I18N"
		var v2 = "跳过这个中文";
	}
};

exports.skip_replace_I18N = function code()
{
	var v1 = '中文';

	{
		"[i18nc] skip_replace@I18N"
		var v2 = "这个中文还在";
	}
};

exports.skip_scan_fail = function code()
{
	var v1 = '中文';

	"[i18nc] skip_scan"
	var v2 = "跳不过这个中文";
};

'use strict';

module.exports = function ()
{
	var win = window;
	var key = '__i18n_lan__'
	var lan = win[key];

	if (!lan && lan !== false)
	{
		// 最好修改cookie的key
		lan = document.cookie.match(/(?:^|;) *test_lan=([^;]+)/);
		if (lan) lan = decodeURIComponent(lan[1]);
		win[key] = lan || false;
	}

	return lan;
}
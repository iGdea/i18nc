'use strict';

module.exports = function()
{
	var win = window;
	var key = '__i18n_lan__'
	var lan = win[key];

	if (!lan && lan !== false)
	{
		// 最好修改cookie的key
		var cookieLans = [];
		document.cookie.replace(/(?:^|;) *test_lan(\d*?)=([^;]+)/g, function(all, version, val) {
			cookieLans[+version || 0] = val;
			return all;
		});
		lan = cookieLans[cookieLans.length - 1];
		if (lan) lan = decodeURIComponent(lan);
		win[key] = lan || false;
	}

	return lan;
}
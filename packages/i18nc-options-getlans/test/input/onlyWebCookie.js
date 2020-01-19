'use strict';

module.exports = function() {
	const win = window;
	const key = '__i18n_lan__';
	let lan = win[key];

	if (!lan && lan !== false) {
		// 最好修改cookie的key
		const cookieLans = [];
		document.cookie.replace(
			/(?:^|;) *test_lan(\d*?)=([^;]+)/g,
			function(all, version, val) {
				cookieLans[+version || 0] = val;
				return all;
			}
		);
		lan = cookieLans[cookieLans.length - 1];
		if (lan) lan = decodeURIComponent(lan);
		win[key] = lan || false;
	}

	return lan;
}
'use strict';

module.exports = function(cache) {
	const key = '__i18n_lan__';
	// cache.g: global
	// cache.p: platform
	if (cache.g) {
		return cache.g[key];
	} else if (cache.p) {
		const dm = process.domain;
		return dm && dm[key];
	} else if (typeof window == 'object') {
		const win = window;
		cache.g = win;
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
	} else if (typeof process == 'object') {
		cache.p = 1;
		const dm = process.domain;
		return dm && dm[key];
	} else {
		cache.g = {};
	}
}
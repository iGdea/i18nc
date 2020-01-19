'use strict';

module.exports = function(
	cache
) {
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
			const nav = win.navigator;
			let navlans = nav && nav.languages;
			const navlan = nav && nav.language;
			if (navlans) lan = '' + navlans;
			else if (navlan) lan = navlan + ',' + navlan.split(/-|_/)[0];

			if (lan) lan = win[key] = lan.toLowerCase().replace(/-/g, '_');
			else win[key] = false;
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
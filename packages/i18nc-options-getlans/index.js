/* global window document */

'use strict';

exports.webAndProcessDomain = exports.webNavigatorAndProcessDomain = function(
	cache
) {
	const key = '$LanguageVars.name$';
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
};

exports.webCookeAndProcssDomian = function(cache) {
	const key = '$LanguageVars.name$';
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
				/(?:^|;) *$LanguageVars.cookie$(\d*?)=([^;]+)/g,
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
};

exports.onlyWebCookie = function() {
	const win = window;
	const key = '$LanguageVars.name$';
	let lan = win[key];

	if (!lan && lan !== false) {
		// 最好修改cookie的key
		const cookieLans = [];
		document.cookie.replace(
			/(?:^|;) *$LanguageVars.cookie$(\d*?)=([^;]+)/g,
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
};

exports.onlyWeb = exports.onlyWebNavigator = function() {
	const key = '$LanguageVars.name$';
	const win = window;
	let lan = win[key];

	if (!lan && lan !== false) {
		const nav = win.navigator;
		const navlans = nav && nav.languages;
		const navlan = nav && nav.language;
		if (navlans) lan = '' + navlans;
		else if (navlan) lan = navlan + ',' + navlan.split(/-|_/)[0];

		if (lan) lan = win[key] = lan.toLowerCase().replace(/-/g, '_');
		else win[key] = false;
	}

	return lan;
};

'use strict';

module.exports = function() {
	const key = '__i18n_lan__';
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
}
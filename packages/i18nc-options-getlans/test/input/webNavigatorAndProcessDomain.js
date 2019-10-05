'use strict';

module.exports = function (cache)
{
	var key = '__i18n_lan__';
	// cache.g: global
	// cache.p: platform
	if (cache.g)
	{
		return cache.g[key];
	}
	else if (cache.p)
	{
		var dm = process.domain;
		return dm && dm[key];
	}
	else if (typeof window == 'object')
	{
		var win = window;
		cache.g = win;
		var lan = win[key];

		if (!lan && lan !== false)
		{
			var nav = win.navigator;
			var navlans = nav && nav.languages;
			var navlan = nav && nav.language;
			if (navlans) lan = ''+navlans
			else if (navlan) lan = navlan+','+navlan.split(/-|_/)[0];

			if (lan)
				lan = win[key] = lan.toLowerCase().replace(/-/g, '_');
			else
				win[key] = false;
		}

		return lan;
	}
	else if (typeof process == 'object')
	{
		cache.p = 1;
		var dm = process.domain;
		return dm && dm[key];
	}
	else
	{
		cache.g = {};
	}
}
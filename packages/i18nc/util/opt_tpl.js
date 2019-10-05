/* global window document */

'use strict';

exports.webAndProcessDomain
	= exports.webNavigatorAndProcessDomain
	= function(cache)
{
	var key = '$LanguageVars.name$';
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
};

exports.webCookeAndProcssDomian = function(cache)
{
	var key = '$LanguageVars.name$';
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
			// 最好修改cookie的key
			lan = document.cookie.match(/(?:^|;) *$LanguageVars.cookie$=([^;]+)/);
			if (lan) lan = decodeURIComponent(lan[1]);
			win[key] = lan || false;
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
};

exports.onlyWebCookie = function()
{
	var win = window;
	var key = '$LanguageVars.name$'
	var lan = win[key];

	if (!lan && lan !== false)
	{
		// 最好修改cookie的key
		lan = document.cookie.match(/(?:^|;) *$LanguageVars.cookie$=([^;]+)/);
		if (lan) lan = decodeURIComponent(lan[1]);
		win[key] = lan || false;
	}

	return lan;
};

exports.onlyWeb
	= exports.onlyWebNavigator
	= function()
{
	var key = '$LanguageVars.name$';
	var win = window;
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
};

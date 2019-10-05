'use strict';

module.exports = function ()
{
	var key = '__i18n_lan__';
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
}
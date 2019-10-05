/* global window */

'use strict';


module.exports = function GetLanguageCodeHandler(cache) {
	if (!cache.global) {
		cache.global = (typeof window == 'object' && window)
			|| (typeof global == 'object' && global)
			|| {};
	}

	return cache.global.$LanguageVars.name$;
}

// fix istanbul for test
// if (process.env.running_under_istanbul)
// {
// 	var GetLanguageCodeFuncCode = GetLanguageCodeHandler.toString();
// 	GetLanguageCodeFuncCode = GetLanguageCodeFuncCode
// 		.replace(/__cov_(.+?)\+\+[,;]?/g, '')
// 		.replace(/else\{\}/, '');
// 	GetLanguageCodeHandler.toString = function()
// 	{
// 		return GetLanguageCodeFuncCode;
// 	};
// }

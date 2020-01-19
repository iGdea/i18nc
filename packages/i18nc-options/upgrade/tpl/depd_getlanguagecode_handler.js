/* global $GetLanguageCode */

'use strict';

module.exports = function GetLanguageCodeHandler(cache) {
	const g = cache.g || (cache.g = $GetLanguageCode);
	return g.$LanguageVars.name$;
};

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

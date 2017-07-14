var _ = require('underscore');

exports.defaults =
{
	cutWordReg				: /[^<>]*[^\u0020-\u007e]+[^<>]*/g,
	handlerName				: 'I18N',
	defaultFilekey			: '',
	translateAllData		: null,
	insertToDefineHalder	: true,
	acceptLanguageCode		: 'typeof window == "object" ? window.__i18n_lan__ : typeof global == "object" && global.__i18n_lan__',
}

exports.extend = function(obj)
{
	return _.extend({}, exports.defaults, obj);
}

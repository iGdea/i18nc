function {{#handlerName}}(msg, subtype, plusExample)
{
	var LAN = {{#acceptLanguageCode}};
	if (!LAN) return msg;

	if ({{#handlerName}}.__TRANSLATE_LAN__ != LAN)
	{
		/* Do not modify this key value. */
		var FILE_KEY = "{{FILE_KEY}}";
		var FUNCTION_VERSION = 1;

		/**
		Do not modify the values.
		If you want, see https://github.com/Bacra/node-i18nc/wiki/How-to-modify-translate-data-in-JS-file
		 */
		var TRANSLATE_DEFAULT_JSON = {{#TRANSLATE_DEFAULT_JSON}};
		var TRANSLATE_SUBTYPE_JSON = {{#TRANSLATE_SUBTYPE_JSON}};

		{{#handlerName}}.__TRANSLATE_LAN__ = LAN;
		{{#handlerName}}.__TRANSLATE_DEFAULT_JSON__ = TRANSLATE_DEFAULT_JSON && TRANSLATE_DEFAULT_JSON[LAN];
		{{#handlerName}}.__TRANSLATE_SUBTYPE_JSON__ = TRANSLATE_SUBTYPE_JSON && TRANSLATE_SUBTYPE_JSON[LAN];
	}

	var subtypeJSON = subtype && {{#handlerName}}.__TRANSLATE_SUBTYPE_JSON__;
	var defaultJSON = {{#handlerName}}.__TRANSLATE_DEFAULT_JSON__;

	return (subtypeJSON && subtypeJSON[subtype] && subtypeJSON[subtype][msg])
		|| (defaultJSON && defaultJSON[msg])
		|| msg;
}

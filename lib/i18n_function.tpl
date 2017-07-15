function {{@handlerName}}(msg, subtype, plusExample)
{
	var LAN = {{@acceptLanguageCode}};
	if (!LAN) return msg;

	var self = {{@handlerName}};
	if (self.__TRANSLATE_LAN__ != LAN)
	{
		/* Do not modify this key value. */
		var FILE_KEY = "{{FILE_KEY}}";
		var FUNCTION_VERSION = 1;

		/**
		Do not modify the values.
		If you want, see https://github.com/Bacra/node-i18nc/wiki/How-to-modify-translate-data-in-JS-file
		 */
		var TRANSLATE_DEFAULT_JSON = {{@TRANSLATE_DEFAULT_JSON}};
		var TRANSLATE_SUBTYPE_JSON = {{@TRANSLATE_SUBTYPE_JSON}};

		self.__TRANSLATE_LAN__ = LAN;
		self.__TRANSLATE_DEFAULT_JSON__ = TRANSLATE_DEFAULT_JSON && TRANSLATE_DEFAULT_JSON[LAN];
		self.__TRANSLATE_SUBTYPE_JSON__ = TRANSLATE_SUBTYPE_JSON && TRANSLATE_SUBTYPE_JSON[LAN];
	}

	var subtypeJSON = subtype && self.__TRANSLATE_SUBTYPE_JSON__;
	var defaultJSON = self.__TRANSLATE_DEFAULT_JSON__;

	return (subtypeJSON && subtypeJSON[subtype] && subtypeJSON[subtype][msg])
		|| (defaultJSON && defaultJSON[msg])
		|| msg;
}

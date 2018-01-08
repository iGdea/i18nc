function {{@handlerName}}(msg, subtype) {
	var self = {{@handlerName}};
{{if setFileLanguages}}
	var LAN = "{{setFileLanguages}}";
{{else}}
	var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = {{@GetGlobalCode}}) || {};
	var LAN = GLOBAL.{{@LanguageVarName}};
{{/if}}
	if (!LAN) return msg;

	if (self.__TRANSLATE_LAN__ != LAN) {
		self.__TRANSLATE_LAN__ = LAN;
		var __FILE_KEY__ = "{{FILE_KEY}}";
		var __FUNCTION_VERSION__ = "{{@FUNCTION_VERSION}}";

		var __TRANSLATE_JSON__ = {{@TRANSLATE_JSON}};

		var lanArr = self.__TRANSLATE_LAN_JSON__ = [];
		if (LAN && LAN.split) {
			var lanKeys = LAN.split(',');
			for(var i = 0, len = lanKeys.length; i < len; i++) {
				var lanItem = __TRANSLATE_JSON__[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
		}
	}

	var lanArr = self.__TRANSLATE_LAN_JSON__,
		resultDefault, resultSubject;
	for(var i = 0, len = lanArr.length; i < len; i++) {
		var lanItem = lanArr[i];
		var subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];
		resultSubject = subtypeJSON && subtypeJSON[msg];
		if (resultSubject) break;
		if (!resultDefault)
			resultDefault = lanItem.DEFAULTS && lanItem.DEFAULTS[msg];
	}

	var result = resultSubject || resultDefault || msg;
	return typeof result == 'string' ? result : ''+result;
}

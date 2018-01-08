function code()
{
	var work = I18N('global 中文1');
	define(function()
	{
		var word = I18N('define1 中文');
	});

	define('define2', function()
	{
		var word = I18N('define2 中文');
		function I18N(msg, subtype) {
			var self = I18N;
		
			var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
			var LAN = GLOBAL.__i18n_lan__;
		
			if (!LAN) return msg;
		
			if (self.__TRANSLATE_LAN__ != LAN) {
				self.__TRANSLATE_LAN__ = LAN;
				var __FILE_KEY__ = "default_file_key";
				var __FUNCTION_VERSION__ = "3";
		
				var __TRANSLATE_JSON__ = { 'zh': { 'DEFAULTS': { 'define2 中文': 'define2 中文' || undefined } } };
		
				var lanArr = self.__TRANSLATE_LAN_JSON__ = [];
				if (LAN && LAN.split) {
					var lanKeys = LAN.split(',');
					for(var i = 0, len = lanKeys.length; i < len; i++) {
						var lanItem = __TRANSLATE_JSON__[lanKeys[i]];
						if (lanItem) lanArr.push(lanItem);
					}
				}
			}
		
			var lanArr = self.__TRANSLATE_LAN_JSON__, resultDefault, resultSubject;
			for(var i = 0, len = lanArr.length; i < len; i++) {
				var lanItem = lanArr[i];
				var subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];
				resultSubject = subtypeJSON && subtypeJSON[msg];
				if (resultSubject) break;
				if (!resultDefault) resultDefault = lanItem.DEFAULTS && lanItem.DEFAULTS[msg];
			}
		
			var result = resultSubject || resultDefault || msg;
			return typeof result == 'string' ? result : ''+result;
		}
	});

	function I18N(msg) {
		var __FILE_KEY__ = "default_file_key";
		var __FUNCTION_VERSION__ = "3.s";
		return typeof msg == 'string' ? msg : ''+msg;
	}
	var work = I18N('global 中文2');
	function I18N(msg, subtype) {
		var self = I18N;
	
		var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
		var LAN = GLOBAL.__i18n_lan__;
	
		if (!LAN) return msg;
	
		if (self.__TRANSLATE_LAN__ != LAN) {
			self.__TRANSLATE_LAN__ = LAN;
			var __FILE_KEY__ = "default_file_key";
			var __FUNCTION_VERSION__ = "3";
	
			var __TRANSLATE_JSON__ = {
					'zh': {
						'DEFAULTS': {
							'define1 中文': 'define1 中文' || undefined,
							'global 中文1': 'global 中文1' || undefined,
							'global 中文2': 'global 中文2' || undefined
						}
					}
				};
	
			var lanArr = self.__TRANSLATE_LAN_JSON__ = [];
			if (LAN && LAN.split) {
				var lanKeys = LAN.split(',');
				for(var i = 0, len = lanKeys.length; i < len; i++) {
					var lanItem = __TRANSLATE_JSON__[lanKeys[i]];
					if (lanItem) lanArr.push(lanItem);
				}
			}
		}
	
		var lanArr = self.__TRANSLATE_LAN_JSON__, resultDefault, resultSubject;
		for(var i = 0, len = lanArr.length; i < len; i++) {
			var lanItem = lanArr[i];
			var subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];
			resultSubject = subtypeJSON && subtypeJSON[msg];
			if (resultSubject) break;
			if (!resultDefault) resultDefault = lanItem.DEFAULTS && lanItem.DEFAULTS[msg];
		}
	
		var result = resultSubject || resultDefault || msg;
		return typeof result == 'string' ? result : ''+result;
	}
}
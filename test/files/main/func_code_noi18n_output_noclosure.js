

function I18N(msg, tpldata, subtype) {
	var self = I18N;
	var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
	var LAN = GLOBAL.__i18n_lan__;
	if (!LAN) return msg;
	if (!tpldata.slice) {
		subtype = tpldata;
		tpldata = [];
	}

	if (self.__TRANSLATE_LAN__ != LAN) {
		self.__TRANSLATE_LAN__ = LAN;
		var __FILE_KEY__ = "*";
		var __FUNCTION_VERSION__ = "3";

		var __TRANSLATE_JSON__ = {
				'en-US': {
					'DEFAULTS': {
						// "中文":
						// "中文2":
						'<e.g.> translate word': null
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
	var replace_index = 0;
	return (''+result).replace(/(%s)|(%\{(.+?)\}%)/g, function() {
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? '' : newVal;
	});
}

function code()
{
	var word = I18N('中文');
	consol.log(word, I18N('中文2'));
}
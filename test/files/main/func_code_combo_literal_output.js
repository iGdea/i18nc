;(function(){


function I18N(msg, subtype) {
	/**
	 * @param  {String} msg      translate words
	 * @param  {String} subtype  indicates a special treatment
	 *
	 * [Warn] I18N Tool collects direct string args of `I18N` callee.
	 * Variables or operators of args are not supported.
	 * @see https://github.com/Bacra/node-i18nc-core/wiki/I18N_handler
	 */

	var self = I18N;

	var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
	var LAN = GLOBAL.__i18n_lan__;

	if (!LAN) return msg;

	if (self.__TRANSLATE_LAN__ != LAN) {
		self.__TRANSLATE_LAN__ = LAN;
		var __FILE_KEY__ = "default_file_key";
		var __FUNCTION_VERSION__ = "3";

		// Formats @see https://github.com/Bacra/node-i18nc-core/wiki/How-to-modify-translate-data-in-JS-file
		var __TRANSLATE_JSON__ = {
				'<LAN KEY>': {
					'DEFAULTS': {
						// "123中文abc":
						// "222简体3332":
						// "中文abc":
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

function code()
{
	var a = I18N('123中文abc');
	var b = '123>' + I18N('中文abc');
	var c = '<span>11</span>55'+'<span>11</span>'+I18N('222简体3332') + '<span>22</span>';
}
})();
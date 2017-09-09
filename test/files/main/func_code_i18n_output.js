function code()
{
	var word = I18N('中文');
	consol.log(word, I18N('中文2'));

	function I18N(msg, subtype) {
		/**
		 * @param  {String} msg      translateKey
		 * @param  {String} subtype  Indicates a special treatment.
		 * 								Use `<line>` to represent continuous relationships.
		 * 								Use `<e.g.>` to provide an example.
		 *								Support `%s` symbol.
		 *
		 *
		 * [Warn]
		 * I18nc Tool collects `I18N` callee arguments for professional translation.
		 * Use simple string arguments when call `I18N`.
		 * Variables and Operators are not supported.
		 *
		 */
	
		var self = I18N;
	
		var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
		var LAN = GLOBAL.__i18n_lan__;
	
		if (!LAN) return msg;
	
		if (self.__TRANSLATE_LAN__ != LAN) {
			self.__TRANSLATE_LAN__ = LAN;
			/* Do not modify this key value. */
			var __FILE_KEY__ = "default_file_key";
			var __FUNCTION_VERSION__ = "3";
	
			/**
			 * Do not modify the values.
			 *
			 * If you really need to update,
			 * please refer to the following method to modify.
			 * More info @see https://github.com/Bacra/node-i18nc-core/wiki/How-to-modify-translate-data-in-JS-file
			 *
			 * @example
			 * {
			 * 	code_modified		: codeModifieResult,
			 * 	db_translate		: DBTranlateResult || codeModifieResult,
			 * 	force_code_modified	: forceCodeModifieResult || DBTranlateResult || codeModifieResult
			 * }
			 */
			var __TRANSLATE_JSON__ = {
					'<LAN KEY>': {
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
}
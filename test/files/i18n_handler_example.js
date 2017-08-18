module.exports = function I18N(msg, subtype)
{
	/**
	 * @param  {String} msg      translateKey
	 * @param  {String} subtype  Indicates a special treatment.
	 * 								Use `<line>` to represent continuous relationships.
	 * 								Use `<e.g.>` to provide an example. Support `%s` symbol.
	 * 
	 * 
	 * [Warn]
	 * I18nc Tool collects `I18N` callee arguments for professional translation.
	 * Use simple string arguments when call `I18N`.
	 * Variables and Operators are not supported.
	 * 
	 */



	var LAN = (typeof window == "object" ? window.__i18n_lan__ : typeof global == "object" && global.__i18n_lan__);
	if (!LAN) return msg;

	var self = I18N;
	if (self.__TRANSLATE_LAN__ != LAN)
	{
		/* Do not modify this key value. */
		var __FILE_KEY__ = "I am a __FILE_KEY__";
		var __FUNCTION_VERSION__ = 1;

		/**
		 * Do not modify the values.
		 *
		 * If you really need to update,
		 * please refer to the following method to modify.
		 * @see https://github.com/Bacra/node-i18nc/wiki/How-to-modify-translate-data-in-JS-file
		 *
		 * @example
		 * {
		 * 	normail_key: dbTranlateResult,
		 * 	use_modified_key: codeModifieResult || prevDBTranlateResult,
		 * 	use_newdb_key: newDBTranlateResult || codeModifieResult || prevDBTranlateResult
		 * }
		 *
		 * @tips Use an empty array to represent an empty string.
		 * @example
		 * {
		 * 	key: [] || 'The translation is empty.'
		 * }
		 */
		var __TRANSLATE_JSON__ = {
			"zh":
			{
				"DEFAULTS":
				{
					'中文0': 'zh0',
					'中文1': 'custom1' || 'zh1',
					'中文2': 'zh2_db' || [] || 'zh2'
				},
				"SUBTYPES":
				{
					'subtype':
					{
						'中文0': 'subtye_zh0',
						'中文1': 'subtye_custom1' || 'subtye_zh1',
						'中文2': 'subtye_zh2_db' || [] || 'subtye_zh2'
					}
				}
			}
		};

		self.__TRANSLATE_LAN__ = LAN;
		self.__TRANSLATE_LAN_JSON__ = __TRANSLATE_JSON__[LAN] || {};
	}

	var defaultJSON = self.__TRANSLATE_LAN_JSON__.DEFAULTS;
	var subtypeJSON = subtype && self.__TRANSLATE_LAN_JSON__.SUBTYPES;

	var result = (subtypeJSON && subtypeJSON[subtype] && subtypeJSON[subtype][msg])
		|| (defaultJSON && defaultJSON[msg])
		|| msg;


	// Taking into account the use of the array that is empty,
	// so the need for mandatory conversion of the results data.
	if (result && result.join)
		return ''+result;
	else
		return result;
}

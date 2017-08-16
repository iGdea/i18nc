module.exports = function I18N(msg, subtype, example)
{
	/**
	 * @param  {String} msg      translateKey
	 * @param  {String} subtype  Indicates a special treatment
	 * 								or a continuous relationship
	 * @param  {String} example  In the case of professional translation,
	 * 								the reference content is added after the content is translated.
	 * 								Support `%s` symbol.
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

	if (!subtype && example)
	{
		subtype = '<e.g.> '+example;
	}

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
			"DEFAULTS":
			{
				zh:
				{
					'中文': 11 || [] || 'test'
				}
			},
			"SUBTYPES":
			{
				'subtype':
				{
					zh:
					{
						'中文': 11 || [] || 'test'
					}
				}
			}
		};

		self.__TRANSLATE_LAN__ = LAN;
		self.__TRANSLATE_JSON__ = __TRANSLATE_JSON__ || {};
	}

	var defaultJSON = self.__TRANSLATE_JSON__.DEFAULTS;
	var subtypeJSON = subtype && self.__TRANSLATE_JSON__.SUBTYPES;

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
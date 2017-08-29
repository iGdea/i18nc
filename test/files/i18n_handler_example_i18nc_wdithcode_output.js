module.exports = I18N;
function I18N(msg, subtype)
{
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

	if (self.__TRANSLATE_LAN__ != LAN)
	{
		/* Do not modify this key value. */
		var __FILE_KEY__ = "i18n_handler_example";
		var __FUNCTION_VERSION__ = 1;
		self.__TRANSLATE_LAN__ = LAN;

		/**
		 * Do not modify the values.
		 *
		 * If you really need to update,
		 * please refer to the following method to modify.
		 * @see https://github.com/Bacra/node-i18nc/wiki/How-to-modify-translate-data-in-JS-file
		 *
		 * @example
		 * {
		 * 	normail_key			: dbTranlateResult,
		 * 	use_modified_key	: codeModifieResult || prevDBTranlateResult,
		 * 	use_newdb_key		: newDBTranlateResult || codeModifieResult || prevDBTranlateResult
		 * 	force_modified_key	: forceCodeModifieResult || newDBTranlateResult || codeModifieResult || prevDBTranlateResult
		 * }
		 *
		 * @tips Use an empty array to represent an empty string.
		 * @example
		 * {
		 * 	key: [] || 'The translation is empty.'
		 * }
		 */
		var __TRANSLATE_JSON__ = {
				'en': {
					'DEFAULTS': {
						'中文0': 'indb <thisfile> db2',
						'中文1': 'in_file custom1' || 'in_file zh1',
						'中文2': 'in_file zh2_db' || '' || 'in_file zh2',
						'中文3_empty': [] || '',
						'中文5_empty': [] || '',
						'中文6_empty': 'in_file 4' || 'in_file 3' || 'in_file 2' || 'in_file 1'
					}
				}
			};

		var lanArr = self.__TRANSLATE_LAN_JSON__ = [];
		if (LAN && LAN.split)
		{
			var lanKeys = LAN.split(',');
			for(var i = 0, len = lanKeys.length; i < len; i++)
			{
				var lanItem = __TRANSLATE_JSON__[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
		}
	}

	var lanArr = self.__TRANSLATE_LAN_JSON__;
	var result;
	for(var i = 0, len = lanArr.length; i < len; i++)
	{
		var lanItem = lanArr[i];
		var defaultJSON = lanItem.DEFAULTS;
		var subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];

		result = (subtypeJSON && subtypeJSON[msg])
			|| (defaultJSON && defaultJSON[msg]);

		if (result) break;
	}

	// Taking into account the use of the array that is empty,
	// so the need for mandatory conversion of the results data.
	if (result && result.join)
		return ''+result;
	else
		return result || msg;
}
var codeJSON = {
	"DEFAULTS": [
		I18N('中文0'),
		I18N('中文1'),
		I18N('中文2'),
		I18N('中文3_empty'),
		I18N('中文4_empty'),
		I18N('中文5_empty'),
		I18N('中文6_empty'),
		I18N('中文db ') + '<allfile>'
	],
	"SUBTYPES": {
		"subtype": [
			I18N('中文0'),
			I18N('中文1'),
			I18N('中文2'),
			I18N('中文3_empty'),
			I18N('中文 allfile subtype1'),
			I18N('中文 thisfile subtype2')
		]
	}
}
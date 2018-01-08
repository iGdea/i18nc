module.exports = I18N;

function I18N(msg, subtype) {
	var self = I18N;

	var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
	var LAN = GLOBAL.__i18n_lan__;

	if (!LAN) return msg;

	if (self.__TRANSLATE_LAN__ != LAN) {
		self.__TRANSLATE_LAN__ = LAN;

		var __FILE_KEY__ = "i18n_handler_example";
		var __FUNCTION_VERSION__ = "3";

		var __TRANSLATE_JSON__ = {
			"en":
			{
				"DEFAULTS":
				{
					'中文0': 'in_file zh0',
					'中文1': 'in_file custom1' || 'in_file zh1',
					'中文2': 'in_file zh2_db' || [] || 'in_file zh2',

					'中文3_empty': '',
					'中文4_empty': '' || '',
					'中文5_empty': [] || '',
					'中文6_empty': 'in_file 4' || 'in_file 3' || 'in_file 2' || 'in_file 1',

					'中文db *': 'in file *'
				},
				"SUBTYPES":
				{
					'subtype':
					{
						'中文0': 'in_file subtye_zh0',
						'中文1': 'in_file ubtye_custom1' || 'in_file subtye_zh1',
						'中文2': 'in_file subtye_zh2_db' || [] || 'in_file subtye_zh2',
						'中文3_empty': '',
						'中文 allfile subtype1': 'in_file allfile subtype1',
						'中文 thisfile subtype2': 'in_file thisfile subtype2',
					}
				}
			},
			"tw":
			{
				"DEFAULTS":
				{
					'中文0': '中文0 in tw'
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

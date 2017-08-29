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
				var __FILE_KEY__ = "default_file_key";
				var __FUNCTION_VERSION__ = 2;
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
				var __TRANSLATE_JSON__ = { 'zh': { 'DEFAULTS': { 'define2 中文': 'define2 中文' } } };
		
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
	});

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
			var __FILE_KEY__ = "default_file_key";
			var __FUNCTION_VERSION__ = 2;
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
					'zh': {
						'DEFAULTS': {
							'define1 中文': 'define1 中文',
							'global 中文1': 'global 中文1',
							'global 中文2': 'global 中文2'
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
	var work = I18N('global 中文2');
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
			var __FILE_KEY__ = "default_file_key";
			var __FUNCTION_VERSION__ = 2;
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
					'zh': {
						'DEFAULTS': {
							'define1 中文': 'define1 中文',
							'global 中文1': 'global 中文1',
							'global 中文2': 'global 中文2'
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
}
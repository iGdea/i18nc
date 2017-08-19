module.exports = function code()
{
    var result;       // 中文注释
    result = "中文0";
    result += "中文1"+1;
    result += "123"+2;
    result += '2中文4中文5';     // 中文注释
    result += "<span>中文span</span>中文span2<span>中文span3"+0;

    var c5 = {
        d1: '中文1',
        d2: ['中文2', '中文3'],
        // '中文4': '中文4',
        c6: function(){}
    }

    c5['中文key'] = '中文val';


    result += c5.c1;
    result += c5.c2;
    result += c5['中文key'];

    function print(msg)
    {
        return '再来' + msg;
    }

    // 中文注释
    result += print('2中');     // 中文注释

    function switch_print(a)
    {
        switch(a)
        {
            case '我中文们':
                result += '我中文们';
                break;

            case 11+'我中文们':
                result += 11+'我中文们';
                break;

            case c5['中文key']:
                result += 11+c5['中文key'];
                break;

            case print('一般不会吧')+'我中文们':
                result += print('一般不会吧')+'我中文们';
                break;
        }
    }

    switch_print('我中文们');
    switch_print(11+'我中文们');
    switch_print(c5['中文key']);
    switch_print(print('一般不会吧')+'我中文们');


    if (!!'我中文们')
    {
        result += true ? '中午呢' : '中文呢？'
    }

    I18N('中文I18N');
    I18N('中文I18N', 'haha');
    I18N('中文I18N2', 'haha');

    // I18N
	function I18N(msg, subtype)
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



		var LAN = 'en';
		if (!LAN) return msg;

		var self = I18N;
		if (self.__TRANSLATE_LAN__ != LAN)
		{
			/* Do not modify this key value. */
			var __FILE_KEY__ = "func_code_file_key";
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
				"tw":
				{
					"DEFAULTS":
					{
						'简体': '簡體',
					},
					"SUBTYPES":
					{
						'subtype':
						{
							'简体++': '簡體--',
							'I18N(中文)': 'I18N(中文)'
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

    result += I18N('I18N(中文)', 'subtype');


    return result;
}

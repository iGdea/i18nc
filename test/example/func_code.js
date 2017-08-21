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
        '中文key in object': '中文val in object',
        c6: function(){}
    }

    c5['中文key'] = '中文val';


    result += c5.c1;
    result += c5.c2;
    result += c5['中文key'];

    function print(msg)
    {
        return '再来一句，' + msg;
    }

    // 中文注释
    result += print('print中文');     // 中文注释

    function switch_print(name)
    {
        switch(name)
        {
            case '中文case':
            case 11+'中文case+数字':
            case c5['中文key']+'中文case+objkey':
            case print('run 中文')+'中文case+handler':
                result += name;
                break;
        }
    }

    switch_print('中文case');
    switch_print(11+'中文case+数字');
    switch_print(c5['中文key']+'中文case+objkey');
    switch_print(print('run 中文')+'中文case+handler');


    if (!!'中文if')
    {
        result += true ? '中午true' : '中文false'
    }

    I18N('中文I18N');
    I18N('中文I18N subtype', 'subtype');
    I18N('中文I18N subtype', 'subtype');

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
    result += I18N('I18N(中文)', 'subtype2');


    return result;
}

module.exports = function code()
{
    var result;       // 中文注释
    result = I18N('中文0');
    result += I18N('中文1')+1;
    result += "123"+2;
    result += I18N('2中文4中文5');     // 中文注释
    result += '<span>' + I18N('中文span') + '</span>' + I18N('中文span2') + '<span>' + I18N('中文span3')+0;

    var c5 = {
        d1: I18N('中文1'),
        d2: [I18N('中文2'), I18N('中文3')],
        // '中文4': '中文4',
        c6: function(){}
    }

    c5[I18N('中文key')] = I18N('中文val');


    result += c5.c1;
    result += c5.c2;
    result += c5[I18N('中文key')];

    function print(msg)
    {
        return I18N('再来') + msg;
    }

    // 中文注释
    result += print(I18N('2中'));     // 中文注释

    function switch_print(a)
    {
        switch(a)
        {
            case I18N('我中文们'):
                result += I18N('我中文们');
                break;

            case 11+I18N('我中文们'):
                result += 11+I18N('我中文们');
                break;

            case c5[I18N('中文key')]:
                result += 11+c5[I18N('中文key')];
                break;

            case print(I18N('一般不会吧'))+I18N('我中文们'):
                result += print(I18N('一般不会吧'))+I18N('我中文们');
                break;
        }
    }

    switch_print(I18N('我中文们'));
    switch_print(11+I18N('我中文们'));
    switch_print(c5[I18N('中文key')]);
    switch_print(print(I18N('一般不会吧'))+I18N('我中文们'));


    if (!!I18N('我中文们'))
    {
        result += true ? I18N('中午呢') : I18N('中文呢？')
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



	var LAN = (typeof window == "object" ? window.__i18n_lan__ : typeof global == "object" && global.__i18n_lan__);
	if (!LAN) return msg;

	var self = I18N;
	if (self.__TRANSLATE_LAN__ != LAN)
	{
		/* Do not modify this key value. */
		var __FILE_KEY__ = "default_file_key";
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
		var __TRANSLATE_JSON__ = {};

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

    result += I18N('I18N(中文)');


    return result;
}
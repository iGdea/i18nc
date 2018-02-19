module.exports = function code()
{
    var result;       // 中文注释
    result = "中文0";
    result += "中文1"+1;

    var c5 = {
        '中文key in object': '中文val in object',
    };
    c5['中文key'] = '中文val';
    result += c5['中文key'];

    function print(msg) {
        return 'print信息，' + msg;
    }

    // 中文注释
    result += print('argv中文');     // 中文注释

    function switch_print(name)
    {
        switch(name)
        {
            case '中文case':
                result += name;
                break;
        }
    }

    switch_print('中文case');

    if (!!'中文if')
    {
        result += true ? '中午true' : '中文false'
    }

    I18N('中文I18N');
    I18N('中文I18N subtype', 'subtype');

    // I18N
	function I18N(msg, subtype)
	{
		var LAN = 'zh';
		if (!LAN) return msg;

		var self = I18N;
		if (self.__TRANSLATE_LAN__ != LAN)
		{
			self.__TRANSLATE_LAN__ = LAN;
			self.__FILE_KEY__ = "func_code_file_key";
			self.__FUNCTION_VERSION__ = "5";
			self.__TRANSLATE_JSON__ =
				{
					'en-US': {
						'DEFAULTS': {
							// "argv中文":
							// "print信息，":
							// "中午true":
							// "中文0":
							// "中文1":
							// "中文I18N":
							// "中文case":
							// "中文false":
							// "中文if":
							// "中文key":
							// "中文val":
							// "中文val in object":
							// "简体":
							'<e.g.> translate word': null
						},
						'SUBTYPES': {
							'subtype': {
								// "中文I18N subtype":
								'I18N(中文)': 'I18N(zh)'
							},
							'subtype2': {
								// "I18N(中文)":
								'<e.g.> translate word': null
							}
						}
					},
					'zh-TW': {
						'DEFAULTS': {
							// "argv中文":
							// "print信息，":
							// "中午true":
							// "中文0":
							// "中文1":
							// "中文I18N":
							// "中文case":
							// "中文false":
							// "中文if":
							'中文key': '中文键',
							// "中文val":
							// "中文val in object":
							'简体': '簡體'
						},
						'SUBTYPES': {
							'subtype': {
								// "中文I18N subtype":
								'I18N(中文)': '中文国际化'
							},
							'subtype2': {
								// "I18N(中文)":
								'<e.g.> translate word': null
							}
						}
					}
				};

			var __TRANSLATE_JSON__ = self.__TRANSLATE_JSON__;
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

		var lanArr = self.__TRANSLATE_LAN_JSON__,
			resultDefault, resultSubject;
		for(var i = 0, len = lanArr.length; i < len; i++)
		{
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

    result += I18N('I18N(中文)', 'subtype');
    result += I18N('I18N(中文)', 'subtype2');
    result += I18N('简体');

    return result;
}

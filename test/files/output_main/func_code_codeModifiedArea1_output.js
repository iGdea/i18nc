module.exports = function code()
{
    var result;       // 中文注释
    result = "中文0";
    result += "中文1"+1;
    result += "123"+2;
    result += "中文 only db";
    result += "中文 only file";
    result += '2中文4中文5';     // 中文注释
    result += "<span>中文span</span>中文span2<span>中文span3"+0;

    var c5 = {
        d1: '中文1',
        d2: ['中文2', '中文3'],
        d3: function(){},
        '中文key in object': '中文val in object',
    }

    c5['中文key'] = '中文val';


    result += c5.d1;
    result += c5.d2;
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
							// "2中文4中文5":
							// "print中文":
							// "run 中文":
							// "中午true":
							'中文 only db': '中文只在数据库',
							// "中文0":
							// "中文1":
							// "中文2":
							// "中文3":
							// "中文I18N":
							// "中文case":
							// "中文case+handler":
							// "中文case+objkey":
							// "中文case+数字":
							// "中文false":
							// "中文if":
							// "中文key":
							// "中文span":
							// "中文span2":
							// "中文span3":
							// "中文val":
							// "中文val in object":
							// "再来一句，":
							// "简体":
							'中文 only file': '中文只在文件'
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
							// "2中文4中文5":
							// "print中文":
							// "run 中文":
							// "中午true":
							'中文 only db': '中文只在数据库',
							// "中文 only file":
							// "中文0":
							// "中文1":
							// "中文2":
							// "中文3":
							// "中文I18N":
							// "中文case":
							// "中文case+handler":
							// "中文case+objkey":
							// "中文case+数字":
							// "中文false":
							// "中文if":
							'中文key': '中文键',
							// "中文span":
							// "中文span2":
							// "中文span3":
							// "中文val":
							// "中文val in object":
							// "再来一句，":
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
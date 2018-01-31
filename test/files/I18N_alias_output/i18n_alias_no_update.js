module.exports = function code()
;(function(){
{

	function I18NNew(g,h,i){var a=I18NNew;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return g;if(!h.slice){i=h;h=[]}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='3';a.__TRANSLATE_JSON__={
					'en-US': {
						'DEFAULTS': {
							// "2中文4中文5":
							// "print中文":
							// "run 中文":
							// "中午true":
							// "中文 only db":
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
							// "中文key":
							// "中文span":
							// "中文span2":
							// "中文span3":
							// "中文val":
							// "中文val in object":
							// "再来一句，":
							// "简体":
							'<e.g.> translate word': null
						},
						'SUBTYPES': {
							'subtype': {
								// "I18N(中文)":
								// "中文I18N subtype":
								'<e.g.> translate word': null
							},
							'subtype2': {
								// "I18N(中文)":
								'<e.g.> translate word': null
							}
						}
					}
				}
	;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,f=j.length;b<f;b++){var c=n[j[b]];if(c)e.push(c)}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,f=e.length;b<f;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[g];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[g]}var q=l||k||g;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=h[p++];return a===undefined||a===null?'':a})}


    var result;       // 中文注释
    result = I18NNew('中文0');
    result += I18NNew('中文1')+1;
    result += "123"+2;
    result += I18NNew('中文 only db');
    result += I18NNew('中文 only file');
    result += I18NNew('2中文4中文5');     // 中文注释
    result += '<span>' + I18NNew('中文span') + '</span>' + I18NNew('中文span2') + '<span>' + I18NNew('中文span3')+0;

    var c5 = {
        d1: I18NNew('中文1'),
        d2: [I18NNew('中文2'), I18NNew('中文3')],
        d3: function(){},
        '中文key in object': I18NNew('中文val in object'),
    }

    c5[I18NNew('中文key')] = I18NNew('中文val');


    result += c5.d1;
    result += c5.d2;
    result += c5[I18NNew('中文key')];

    function print(msg)
    {
        return I18NNew('再来一句，') + msg;
    }

    // 中文注释
    result += print(I18NNew('print中文'));     // 中文注释

    function switch_print(name)
    {
        switch(name)
        {
            case I18NNew('中文case'):
            case 11+I18NNew('中文case+数字'):
            case c5[I18NNew('中文key')]+I18NNew('中文case+objkey'):
            case print(I18NNew('run 中文'))+I18NNew('中文case+handler'):
                result += name;
                break;
        }
    }

    switch_print(I18NNew('中文case'));
    switch_print(11+I18NNew('中文case+数字'));
    switch_print(c5[I18NNew('中文key')]+I18NNew('中文case+objkey'));
    switch_print(print(I18NNew('run 中文'))+I18NNew('中文case+handler'));


    if (!!I18NNew('中文if'))
    {
        result += true ? I18NNew('中午true') : I18NNew('中文false')
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
			self.__FUNCTION_VERSION__ = "3";
			self.__TRANSLATE_JSON__ =
				{
					'en-US': {
						'DEFAULTS': {
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
							// "中文 only db":
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
							// "中文key":
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
								// "I18N(中文)":
								// "中文I18N subtype":
								'<e.g.> translate word': null
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
})();
module.exports = function code()
{
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

    I18NNew('中文I18N');
    I18NNew('中文I18N subtype', 'subtype');
    I18NNew('中文I18N subtype', 'subtype');

    // I18N
	function I18NNew(h,f,i){var a=I18NNew;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return h;if(!f||!f.slice){i=f;f=[]}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='func_code_file_key';a.__FUNCTION_VERSION__='5';a.__TRANSLATE_JSON__={
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
				}
	;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=n[j[b]];if(c)e.push(c)}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var q=l||k||h;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})}

    result += I18NNew('I18N(中文)', 'subtype');
    result += I18NNew('I18N(中文)', 'subtype2');
    result += I18NNew('简体');

    return result;
}
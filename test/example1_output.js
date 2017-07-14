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


    // I18N
    function I18N(msg, type, example){/* Do not modify this key value. */var FILE_KEY="";var DEFAULT_JSON={};var LAN=typeof window == "object" ? window.__i18n_lan__ : typeof global == "object" && global.__i18n_lan__;/* It is must a json. */var CUSTOM_JSON={};return (LAN && ((FILE_KEY && CUSTOM_JSON[LAN]) || DEFAULT_JSON[LAN])) || msg;}

    result += I18N('I18N(中文)');


    return result;
}
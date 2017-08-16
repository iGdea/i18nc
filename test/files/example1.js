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


    // I18N
    function I18N(msg)
    {
        return msg
    }

    result += I18N('I18N(中文)');


    return result;
}

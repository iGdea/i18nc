module.exports = function code()
{
    var result;       // 中文注释
    result = "中文0";
    result += "中文1"+1;
    result += "123"+2;
    result += '2中文4中文5';     // 中文注释
    result += "<span>中文3</span>"+0;

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

    switch(a)
    {
        case '我中文们':
            result += '我中文们';
            break;

        case 11+'我中文们':
            result += 11+'我中文们';
            break;

        case print('一般不会吧')+'我中文们':
            result += print('一般不会吧')+'我中文们';
            break;
    }

    if (!!'我中文们')
    {
        result += true ? '中午呢' : '中文呢？'
    }


    // define 的处理
    var define = 'hihi';
    function define(){}

    define(function()
    {
        var someCode = '111';
        define(function()
        {
            var someCode2 = '111';
        });
    });


    // I18N
    function I18N(msg)
    {
        return msg
    }

    result += I18N('I18N(中文)');


    return result;
}

module.exports = function code()
{
    var ccc;       // 中文注释
    var c2 = "中文0";
    var c1 = "中文"+0;
    var c1 = "123"+0;
    var c1 = "<span>12中文</span>"+0;

    var c5 = {
        d1: '中文1',
        d2: ['中文2', '中文3'],
        // '中文4': '中文4',
        c6: function(){}
    }

    // 中文注释
    console.log('2中');     // 中文注释

    var c3 = '2中文4中文5';     // 中文注释
    var dd;     // 中文注释
    switch(a)
    {
        case '我中文们':
        case 11+'我中文们':
        case dd()+'我中文们':
    }

    if (c5.c6 == '我中文们')
    {
        c5['我中文们']
        c2 += '中文';
        true ? '中午呢' : '中文呢？'
    }

    // 中文注释
    for(;;)
    {
        function c8(){}
    }
}

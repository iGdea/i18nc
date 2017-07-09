function code()
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



var _ = require('underscore');
var esprima = require('esprima');
var escodegen = require('escodegen');
var esprimaOptions = {range: true};

var ast = esprima.parse(code.toString(), esprimaOptions);
console.log(' ============== ');




function warpTxt2caller(txt)
{
    return {
        __skip_property__: true,
        "type": "CallExpression",
        "callee": {
            "type": "Identifier",
            "name": "I18N"
        },
        "arguments": [warpTxt(txt)]
    };
}

function warpTxt(txt)
{
    return {
        __skip_property__: true,
        "type": "Literal",
        "value": txt
    };
}


// 整理成ast的数组
function txtarr(arr)
{
    if (!arr || !arr.length) return;

    var firstValue;
    var isFirstZh;
    var nextValue;
    var endIndex = -1;

    arr.some(function(item, index)
    {
        if (!item || !item.value) return;

        if (!firstValue)
        {
            firstValue = item.value;
            isFirstZh = item.zh;
        }
        else if (!nextValue)
        {
            if (item.zh == isFirstZh)
            {
                firstValue += item.value;
            }
            else
            {
                nextValue = item.value;
            }
        }
        else
        {
            if (item.zh == isFirstZh)
            {
                endIndex = index;
                return true;
            }
            else
            {
                nextValue += item.value;
            }
        }
    });

    if (!firstValue) return;

    var result = [];
    result.push(isFirstZh ? warpTxt2caller(firstValue) : warpTxt(firstValue));
    if (!nextValue) return result;

    result.push(isFirstZh ? warpTxt(nextValue) : warpTxt2caller(nextValue));

    var children = endIndex != -1 && txtarr(arr.slice(endIndex));
    if (children) result = result.concat(children);

    return result;
}

// 将Txtarr结果，加上“+”运算
function wrapTxtarr(arr)
{
    if (!arr || !arr.length) return;
    if (arr.length == 1) return arr[0];


    // var result = arr.pop();
    // for(var i = arr.length; i--;)
    // {
    //     result =
    //     {
    //         "type": "BinaryExpression",
    //         "operator": "+",
    //         "left": arr[i],
    //         "right": result
    //     }
    // }

    var result = arr.shift();
    arr.forEach(function(item)
    {
        result =
        {
            __skip_property__: true,
            "type": "BinaryExpression",
            "operator": "+",
            "left": result,
            "right": item
        }
    });

    return result;
}


function dealLiteral(value, parent, itemName)
{
    // case 有可能不是string
    if (!value || typeof value != 'string') return;

    // 正则说明
    // 必须要有非accii之外的祝福（当作是中文）
    // 同时包含非html标签的其他字符
    var splitZhArr = value.split(/[^<>]*[^\u0020-\u007e]+[^<>]*/);
    if (splitZhArr.length < 2) return;


    var zhArr = value.match(/[^<>]*[^\u0020-\u007e]+[^<>]*/g);
    var dealArr = [];
    // zhArr 必然比splitZhArr少一个
    zhArr.forEach(function(val, index)
    {
        dealArr.push(
            {zh: false, value: splitZhArr[index]},
            {zh: true, value: val}
        );
    });

    dealArr.push({zh: false, value: splitZhArr.pop()});

    var result = wrapTxtarr(txtarr(dealArr));
    if (result)
    {
        parent[itemName] = result;
        return zhArr;
    }
}


function scan(ast, parent, itemName)
{
    if (!ast || ast.__skip_property__) return;

    var result = {};

    // 定义I18N
    if (ast.type == 'FunctionDeclaration' && ast.id && ast.id.name == 'I18N')
    {
        return {
            i18nFuncAst: [ast]
        };
    }

    // 如果发现define函数，就留心一下，可能要插入I18N函数
    if (ast.type == 'CallExpression' && ast.id && ast.id.name == 'define')
    {
        ast.arguments.some(function(item)
        {
            if (item.type == 'FunctionExpression')
            {
                result.defineFuncAst = [item];
                return true;
            }
        });
    }

    // 调用I18N
    if (ast.type == 'CallExpression' && ast.callee.name == 'I18N')
    {
        var arg1 = ast.arguments[0];
        if (arg1.type == 'Literal') return [arg1.value];
        return;
    }

    if (ast.type == 'Literal')
    {
        result.zhs = dealLiteral(ast.value, parent, itemName);
        return result;
    }


    var zhs = [];
    _.each(ast, function(item, ast_key)
    {
        if (Array.isArray(item))
        {
            var isObjectProperty = ast.type == 'ObjectExpression' && ast_key == 'properties';
            item.map(function(ast2, index)
                {
                    var ret = scan(ast2, item, index);
                    if (ret)
                    {

                    }
                    if (isObjectProperty && ast2.key.__skip_property__)
                    {
                        throw new Error("[I18N Func Replacer] Object property use ZH, it can't use i18n");
                    }
                    return ret;
                });

            if (result2.length) result = result.concat.apply(result, result2);
        }
        else if (typeof item == 'object')
        {
            var result2 = scan(item, ast, ast_key);
            if (result2) result = result.concat(result2);
        }
    });

    return _.uniq(result);
}



function findLiteralWalker(ast)
{
    return scan(ast);
}






var zhChars = findLiteralWalker(ast)

var newCode = escodegen.generate(ast, escodegenOptions);

console.log(' ============== ');
console.log(newCode);


var newAst = esprima.parse(newCode, esprimaOptions);

console.log(' ============== ');
console.log(zhChars);

var newZhChars = findLiteralWalker(newAst)
var newCode2 = escodegen.generate(newAst, escodegenOptions);

console.log(' ============== ');
console.log(newCode2);


console.log(' ============== ');
console.log(newZhChars);

esprima.parse(newCode2, esprimaOptions);

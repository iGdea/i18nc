'use strict';

var _ = require('lodash');
var fs = require('fs');
var esprima = require('esprima');
var tpl = fs.readFileSync(__dirname+'/doc-tpl/options.tpl').toString();
var content = fs.readFileSync(__dirname+'/../../lib/options.js').toString();
var ast = esprima.parse(content, {attachComment: true});
var ArrayPush = Array.prototype.push;
var parseComment = require('comment-parser');
var debug = require('debug')('i18nc-core:doc-options');

var astArr = [];
ast.body.some(function(item)
{
	var expression = item.expression;
	if (item.type == 'ExpressionStatement'
		&& expression
		&& expression.type == 'AssignmentExpression'
		&& expression.operator == '='
		&& expression.left
		&& expression.left.type == 'MemberExpression'
		&& expression.left.object.name == 'exports'
		&& expression.left.property.name == 'defaults'
		&& expression.right.type == 'ObjectExpression')
	{
		astArr = objectAstFind(item.expression.right);
		return true;
	}
});

debug('astArr len:%s', astArr.length);

var tableInfo = [];
astArr.forEach(function(item)
{
	if (item.comments && item.comments.length)
	{
		var comment = parseComment('/*'+item.comments.pop().value+'*/')[0];
		debug('name: %s, comment: %o', item.name, comment);

		var output = {name: item.name};
		if (comment.tags)
		{
			comment.tags.forEach(function(tag)
			{
				switch(tag.tag)
				{
					case 'type':
						output.type = tag.type;
						break;

					case 'default':
					case 'remark':
						output[tag.tag] = tag.name;
						break;

				}
			});
		}
		if (!output.description)
		{
			output.description = comment.description.split('\n').shift();
		}
		if (!output.default) output.default = item.default;

		debug('output:%o', output);
		tableInfo.push(output);
	}
	else
	{
		debug('no comments key:%s', item.name);
	}
});




/*
 整理数据，输出table格式
 */

/*
 * 汇总单个key包含的注释条数
 * 方便后续计算rowspan
 */
var maxCollsLength = 0;
var tableContentMap = {};
tableInfo.forEach(function(item)
{
	var nameArr = item.name.split('.');
	item.nameArr = nameArr;
	var name2 = '';
	var tmp;
	var len = 0;
	nameArr.forEach(function(name)
	{
		name2 += name2.length ? '.'+name : name;
		len++;
		if (maxCollsLength < len) maxCollsLength = len;
		tmp = tableContentMap[name2];
		if (!tmp) tmp = tableContentMap[name2] = {name: name2, items: [], length: len};
		tmp.items.push(item);
	});
	tmp.item = item;
});


var emptyRowspan = [];
var tableContentArr = _.map(tableContentMap, function(item)
	{
		return item;
	})
	.sort(function(a, b)
	{
		return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
	})
	.map(function(item)
	{
		// 没有注释内容的条数，带有rowspan信息，先收集
		var nameArr = item.name.split('.');
		var subitemLen = item.items.length;
		if (!item.item)
		{
			if (subitemLen)
			{
				emptyRowspan.push(
				{
					// 没有输出过key名前，标记一下
					// 避免table 变量一栏，只有最后一个key
					print: false,
					index: nameArr.length - 1,
					length: subitemLen,
				});
			}
			return '';
		}


		// 有注释数据时
		// 先输出一行完整的变量名
		// 下一行再计算rowspan
		var defaultVal = item.item.default;
		if (defaultVal === undefined) defaultVal = '';
		var keyname = nameArr[nameArr.length-1];
		var leftCollsLength = maxCollsLength - nameArr.length;
		var nameRow = '';

		if (emptyRowspan)
		{
			var tmp = emptyRowspan;
			emptyRowspan = [];
			tmp.sort(function(a, b)
				{
					return a.index > b.index ? 1 : -1;
				})
				.forEach(function(item)
				{
					if (item.print)
					{
						if (item.length == 1)
							nameRow += '<td></td>';
						else
							nameRow += '<td rowspan="'+item.length+'"></td>';
					}
					else
					{
						nameRow += '<td>'+nameArr[item.index]+'</td>';

						if (item.length -1 > 0)
						{
							emptyRowspan.push(
							{
								print: true,
								index: item.index,
								length: item.length - 1,
							});
						}
					}
				});
		}

		if (subitemLen > 1)
		{
			emptyRowspan.push(
			{
				print: true,
				index: nameArr.length - 1,
				length: subitemLen - 1
			});

			nameRow += '<td>'+keyname+'</td>';
			if (leftCollsLength == 1)
				nameRow += '<td></td>';
			else if (leftCollsLength > 1)
				nameRow += '<td colspan="'+leftCollsLength+'"></td>';
		}
		else
		{
			if (leftCollsLength)
				nameRow += '<td colspan="'+(leftCollsLength+1)+'">'+keyname+'</td>';
			else
				nameRow += '<td>'+keyname+'</td>';
		}

		var arr =
		[
			'<tr>',
				nameRow,
				'<td>'+(item.item.type || '')+'</td>',
				'<td>'+defaultVal+'</td>',
				'<td>'+(item.item.description || '')+'</td>',
				'<td>'+(item.item.remark || '')+'</td>',
			'</tr>'
		];

		return arr.join('');
	});

var tableContent =
[
	'<table>',
	'\t<tr>',
	'\t\t<th colspan="'+maxCollsLength+'">变量</th>',
	'\t\t<th>类型</th>',
	'\t\t<th>默认值</th>',
	'\t\t<th>描述</th>',
	'\t\t<th>备注</th>',
	'\t</tr>',
	'\t'+tableContentArr.filter(function(val){return val}).join('\n\t'),
	'</table>'
].join('\n');

var fileContent = tpl.replace(/\$TABLE_DATA/, tableContent);

fs.writeFileSync(__dirname+'/../../doc/zh-CN/options.md', fileContent);


function objectAstFind(ast, parentName)
{
	var result = [];
	ast.properties.forEach(function(item)
	{
		var name = item.key.name;
		if (parentName) name = parentName+'.'+name;
		var obj = {name: name, comments: item.leadingComments};

		if (item.value.type == 'Literal')
		{
			obj.default = item.value.value;
			result.push(obj);
		}
		else
		{
			result.push(obj);
			switch(item.value.type)
			{
				case 'ObjectExpression':
					ArrayPush.apply(result, objectAstFind(item.value, name));
					break;

				case 'CallExpression':
				case 'NewExpression':
					var callAst = item.value.arguments[0];
					if (callAst.type == 'ObjectExpression')
					{
						ArrayPush.apply(result, objectAstFind(callAst, name));
					}
					break;
			}
		}
	});

	return result;
}

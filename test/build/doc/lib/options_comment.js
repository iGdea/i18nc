'use strict';

var debug = require('debug')('i18nc-core:doc_lib/options_comment');
var esprima = require('esprima');
var parseComment = require('comment-parser');
var ArrayPush = Array.prototype.push;
var codeMapTable = require('./codemap_table');

module.exports = function(content)
{
	var ast = esprima.parse(content, {attachComment: true});
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
			&& expression.left.object.name == 'module'
			&& expression.left.property.name == 'exports'
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
							var str = tag.name;
							if (tag.type) str += ' '+tag.type;
							if (tag.description) str += ' '+tag.description;
							output[tag.tag] = str;
							break;

					}
				});
			}
			if (!output.description)
			{
				output.description = comment.description.trim().split('\n').shift();
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



	var tableContent = codeMapTable.table_names(tableInfo, function(info)
		{
			var defaultVal = info.default;
			if (defaultVal === undefined)
				defaultVal = '';
			else if (typeof defaultVal == 'string')
				defaultVal = defaultVal.trim();
			else
				defaultVal += '';

			return [
				'<td>'+(info.type || '')+'</td>',
				'<td>'+defaultVal+'</td>',
				'<td class="table_options_desc">'+(info.description || '')+'</td>',
				'<td class="table_options_remark">'+(info.remark || '')+'</td>'
			]
			.join('');
		});

	return [
		'<table class="table_big table_options">',
		'\t<tr>',
		'\t\t<th colspan="'+tableContent.maxCollsLength+'">变量</th>',
		'\t\t<th>类型</th>',
		'\t\t<th>默认值</th>',
		'\t\t<th class="table_options_desc">描述</th>',
		'\t\t<th class="table_options_remark">备注</th>',
		'\t</tr>',
		'\t'+tableContent.content.join('\n\t'),
		'</table>'
	].join('\n');

}


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

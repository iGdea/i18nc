'use strict';

var _ = require('lodash');
var debug = require('debug')('i18nc-core:doc-lib/options-comment');
var esprima = require('esprima');
var parseComment = require('comment-parser');
var ArrayPush = Array.prototype.push;

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






	/*
	 整理数据，输出table格式
	 */

	/*
	 * 汇总单个key包含的注释条数
	 * 方便后续计算rowspan
	 */
	var maxCollsLength = 0;
	function Key(name, parent)
	{
		var deep = parent ? parent.deep+1 : -1;
		this.name = name;
		this.parent = parent;
		this.info = null;
		this.deep = deep;
		this.maxDeep = deep;
		this.child_count = 0;
		this.children = {};
		this.rendered = parent ? 'none' : 'all';
	}

	_.extend(Key.prototype,
	{
		renderParents: function()
		{
			var parent = this.parent;
			if (!parent) return '';

			return parent.renderSelfName(false);

		},
		renderSelfName: function(isCloseRight)
		{
			var type = this.rendered;

			switch(type)
			{
				case 'none':
					var rowspan = this.child_count;
					if (this.info) rowspan++;
					var str;
					var leftCollsLength = maxCollsLength - this.deep;
					var colspan = isCloseRight &&  leftCollsLength > 1
						? ' colspan="'+leftCollsLength+'"' : '';

					if (rowspan == 1)
					{
						str = '<td'+colspan+'>'+this.name+'</td>';
						this.rendered = 'all';
					}
					else if (rowspan == 2)
					{
						str = '<td rowspan="'+rowspan+'"'+colspan+'>'+this.name+'</td>';
						this.rendered = 'all';
					}
					else
					{
						str = '<td'+colspan+'>'+this.name+'</td>';
						this.rendered = 'onlyone';
					}

					return this.renderParents()+str;

				case 'onlyone':
					var rowspan = this.child_count-1;
					if (this.info) rowspan++;
					var str = rowspan == 1
						? '<td></td>'
						: '<td rowspan="'+rowspan+'"></td>';

					this.rendered = 'all';
					return this.renderParents()+str;

				case 'all':
				default:
					return '';
			}
		},
		render: function()
		{
			var self = this;
			var result = [];

			// 直接输出
			// 需要计算之前已经输出的row
			if (self.info)
			{
				var defaultVal = self.info.default;
				if (defaultVal === undefined)
					defaultVal = '';
				else if (typeof defaultVal == 'string')
					defaultVal = defaultVal.trim();
				else
					defaultVal += '';

				var str =
				[
					'<tr>',
						self.renderSelfName(true),
						'<td>'+(self.info.type || '')+'</td>',
						'<td>'+defaultVal+'</td>',
						'<td>'+(self.info.description || '')+'</td>',
						'<td>'+(self.info.remark || '')+'</td>',
					'</tr>'
				]
				.join('');

				result.push(str);
			}


			_.map(self.children, function(item)
				{
					return item;
				})
				.sort(function(a, b)
				{
					if (a.maxDeep == b.maxDeep)
						return a.name > b.name ? 1 : -1;
					else
						return a.maxDeep > b.maxDeep ? 1 : -1;
				})
				.forEach(function(item)
				{
					ArrayPush.apply(result, item.render());
				});

			return result;
		}
	});

	var tableContentMap = new Key();
	tableInfo.forEach(function(item)
	{
		var nameArr = item.name.split('.');
		item.nameArr = nameArr;
		var tmp = tableContentMap;
		var nameLen = nameArr.length;
		maxCollsLength = Math.max(maxCollsLength, nameLen);

		nameArr.forEach(function(subname)
		{
			var tmp2 = tmp.children[subname];
			if (!tmp2) tmp2 = tmp.children[subname] = new Key(subname, tmp);
			tmp = tmp2;
			tmp.child_count++;
			tmp.maxDeep = Math.max(tmp.maxDeep, nameLen);
		});
		tmp.child_count--;
		tmp.info = item;
	});


	return [
		'<table class="table_big table_options">',
		'\t<tr>',
		'\t\t<th colspan="'+maxCollsLength+'">变量</th>',
		'\t\t<th>类型</th>',
		'\t\t<th>默认值</th>',
		'\t\t<th>描述</th>',
		'\t\t<th>备注</th>',
		'\t</tr>',
		'\t'+tableContentMap.render().join('\n\t'),
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

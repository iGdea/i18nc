'use strict';

var _ = require('lodash');
var debug = require('debug')('i18nc-core:doc-lib/result-comment');
var esprima = require('esprima');
var parseComment = require('comment-parser');
var codeMapTable = require('./codemap-table');
var ArrayPush = Array.prototype.push;

function AstFunc(name, ast, comments)
{
	this.name = name;
	this.ast = ast;
	this.subfuncs = [];

	var comment = comments && comments.pop();
	this.comment = comment && comment.value;
}

_.extend(AstFunc.prototype,
{
	toString: function()
	{
		return this.name;
	},
	add: function(funcs)
	{
		ArrayPush.apply(this.subfuncs, funcs);
	},
	funcname: function()
	{
		var args = _.map(this.ast.params, function(item)
		{
			return item.name;
		});

		return this.name+'('+args.join(', ')+')';
	},
	toJSON: function()
	{
		var comment;
		if (this.comment)
		{
			comment = parseComment('/*'+this.comment+'*/')[0];
		}

		return {
			funcname: this.funcname(),
			comment: comment,
			subfuncs: this.subfuncs.map(function(item)
			{
				return item.toJSON();
			}),
		};
	},
	render: function()
	{
		var obj = this.toJSON();
		var content = [];
		content.push('## '+obj.funcname);

		var tableData = [];
		obj.subfuncs.forEach(function(item)
		{
			if (!item.comment) return;

			var info =
			{
				description: item.comment.description
			};
			debug('comment tags:%o', item.comment.tags);
			item.comment.tags.forEach(function(tag)
			{
				switch(tag.tag)
				{
					case 'return':
						info.return = tag.type;
						break;
				}
			});

			tableData.push([item.funcname, info.return || '', info.description || '']);
		});

		if (tableData.length)
		{
			var tableInfo = codeMapTable.table_md(tableData,
				[
					{name: '方法名'},
					{name: '返回值'},
					{name: '说明'}
				]);
			content.push('### '+'成员方法', tableInfo.content);
		}

		return content.join('\n\n');
	}
});

function findObject(ast)
{
	var result = [];
	if (!ast) return result;

	if (ast.type == 'ObjectExpression')
	{
		ast.properties.forEach(function(item)
		{
			if (item.type != 'Property') return;
			if (!item.value || item.value.type != 'FunctionExpression') return;

			result.push(new AstFunc(item.key.name, item.value, item.leadingComments));
		});

		return result;
	}
	else if (Array.isArray(ast))
	{
		ast.forEach(function(item)
		{
			ArrayPush.apply(result, findObject(item));
		});

		return result;
	}
	else if (typeof ast == 'object')
	{
		_.each(ast, function(body)
		{
			ArrayPush.apply(result, findObject(body));
		});

		return result;
	}
}


module.exports = function(content)
{
	var allConstructor = {};
	var ast = esprima.parse(content, {attachComment: true});
	var currentFunc = null;
	ast.body.forEach(function(item)
	{
		if (item.type == 'FunctionDeclaration'
			&& item.id
			&& item.id.name)
		{
			var name = item.id.name;
			if (allConstructor[name]) throw new Error('func has inited');
			currentFunc = allConstructor[name] = new AstFunc(name, item, item.leadingComments);
		}
		else
		{
			var funcs = findObject(item);
			if (funcs.length)
			{
				if (!currentFunc) throw new Error('init object before currentFunc init');
				currentFunc.add(funcs);
			}
		}
	});

	debug('funcs: %o', allConstructor);

	return allConstructor;
}

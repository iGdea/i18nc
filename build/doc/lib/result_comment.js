'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc-core:doc_lib/result_comment');
const esprima = require('esprima');
const parseComment = require('comment-parser');
const codeMapTable = require('./codemap_table');
const ArrayPush = Array.prototype.push;

function AstFunc(name, ast, comments) {
	this.name = name;
	this.ast = ast;
	this.subfuncs = [];

	const comment = comments && comments.pop();
	this.comment = comment && comment.value;
}

_.extend(AstFunc.prototype, {
	toString: function() {
		return this.name;
	},
	add: function(funcs) {
		ArrayPush.apply(this.subfuncs, funcs);
	},
	funcname: function() {
		const args = _.map(this.ast.params, function(item) {
			return item.name;
		});

		return this.name + '(' + args.join(', ') + ')';
	},
	toJSON: function() {
		const comment = this.comment && parseComment('/*' + this.comment + '*/')[0];

		return {
			name: this.name,
			funcname: this.funcname(),
			comment: comment,
			subfuncs: this.subfuncs.map(function(item) {
				return item.toJSON();
			})
		};
	},
	render: function() {
		const obj = this.toJSON();
		const content = [];
		content.push('## ' + obj.name);
		content.push(obj.funcname);
		if (obj.comment) {
			content.push(' > ' + obj.comment.description);
		}

		const tableData = [];
		obj.subfuncs.forEach(function(item) {
			if (!item.comment) return;

			const info = {
				description: item.comment.description
			};
			debug('comment tags:%o', item.comment.tags);
			item.comment.tags.forEach(function(tag) {
				switch (tag.tag) {
					case 'return':
						info.return = tag.type;
						break;
				}
			});

			tableData.push([
				item.funcname,
				info.return || '',
				info.description || ''
			]);
		});

		if (tableData.length) {
			const tableInfo = codeMapTable.table_md(tableData, [
				{ name: '方法名' },
				{ name: '返回值' },
				{ name: '说明' }
			]);
			content.push('### ' + '成员方法', tableInfo.content);
		}

		return content.join('\n\n');
	}
});

function findObject(ast) {
	const result = [];
	if (!ast) return result;

	if (ast.type == 'ObjectExpression') {
		ast.properties.forEach(function(item) {
			if (item.type != 'Property') return;
			if (!item.value || item.value.type != 'FunctionExpression') return;

			result.push(
				new AstFunc(item.key.name, item.value, item.leadingComments)
			);
		});

		return result;
	} else if (Array.isArray(ast)) {
		ast.forEach(function(item) {
			ArrayPush.apply(result, findObject(item));
		});

		return result;
	} else if (typeof ast == 'object') {
		_.each(ast, function(body) {
			ArrayPush.apply(result, findObject(body));
		});

		return result;
	}
}

module.exports = function(content) {
	const allConstructor = {};
	const ast = esprima.parse(content, { attachComment: true });
	let currentFunc = null;
	ast.body.forEach(function(item) {
		if (item.type == 'FunctionDeclaration' && item.id && item.id.name) {
			const name = item.id.name;
			if (allConstructor[name]) throw new Error('func has inited');
			currentFunc = allConstructor[name] = new AstFunc(
				name,
				item,
				item.leadingComments
			);
		} else {
			const funcs = findObject(item);
			if (funcs.length) {
				if (!currentFunc)
					throw new Error('init object before currentFunc init');
				currentFunc.add(funcs);
			}
		}
	});

	debug('funcs: %o', allConstructor);

	return allConstructor;
};

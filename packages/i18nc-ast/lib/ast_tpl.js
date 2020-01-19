'use strict';

const SELF_CREATED_FLAG = require('./ast_flags').AST_FLAGS.SELF_CREATED;

exports.Property = function Property(name, valueAst) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'Property',
		key: {
			type: 'Literal',
			value: name
		},
		computed: false,
		value: valueAst,
		kind: 'init',
		method: false,
		shorthand: false
	};
};

exports.ObjectExpression = function ObjectExpression(propertiesAst) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'ObjectExpression',
		properties: propertiesAst
	};
};

exports.CallExpression = function CallExpression(name, argumentsAst) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'CallExpression',
		callee: {
			type: 'Identifier',
			name: name
		},
		arguments: argumentsAst
	};
};

exports.ArrayExpression = function ArrayExpression(elementsAst) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'ArrayExpression',
		elements: elementsAst
	};
};

exports.Literal = function Literal(val) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'Literal',
		value: val
	};
};

exports.BinaryExpression = function BinaryExpression(leftAst, rightAst) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'BinaryExpression',
		operator: '+',
		left: leftAst,
		right: rightAst
	};
};

exports.LineComment = function LineComment(value) {
	return {
		type: 'Line',
		value: value
	};
};

exports.NewExpression = function NewExpression(name, argumentsAst) {
	return {
		__i18n_flag__: SELF_CREATED_FLAG,
		type: 'NewExpression',
		callee: {
			type: 'Identifier',
			name: name
		},
		arguments: argumentsAst
	};
};

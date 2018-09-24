'use strict';

var _			= require('lodash');
var debug		= require('debug')('i18nc-core:i18n_func_parser');
var emitter		= require('../emitter');
var escodegen	= require('escodegen');
var jsoncode	= require('./jsoncode');


/**
 * 分析i18n函数，提取相关信息：
 * __FUNCTION_VERSION__
 * __FILE_KEY__
 * __TRANSLATE_JSON__
 *
 * 参数 result 是中间运算结果
 *
 * input: test/files/casefile/i18n_handler/i18n_handler_example.json
 * output: test/files/casefile/i18n_handler/i18n_handler_example_output.json
 */
exports.parse = paseI18nHandlerInfo;
function paseI18nHandlerInfo(ast, options, result)
{
	if (!ast) return;

	var isFirstDeep = false;
	if (!result)
	{
		isFirstDeep = true;
		// 第一次遍历，可以获取到函数名
		result =
		{
			handlerName: ast.id && ast.id.name,
		};

		// 第一次遍历，还要检查return 是否使用了全局变量
		var funcBodyAst = ast.body && ast.body.body;
		var lastBodyItem = funcBodyAst[funcBodyAst.length - 1];
		var firstArgName = ast.params && ast.params[0] && ast.params[0].name;
		debug('get handlerName:%s, firstArgName: %s', result.handlerName, firstArgName);

		var lastBodyArgument = lastBodyItem && lastBodyItem.argument;
		if (lastBodyItem
			&& lastBodyArgument
			&& lastBodyItem.type == 'ReturnStatement'
			&& lastBodyArgument.type == 'BinaryExpression'
			&& lastBodyArgument.operator == '+'
			&& lastBodyArgument.left
			&& lastBodyArgument.left.type == 'Literal'
			&& lastBodyArgument.left.value === '')
		{
			var rightAst = lastBodyArgument.right;

			if (rightAst.type == 'CallExpression'
				&& rightAst.arguments
				&& rightAst.arguments[0]
				&& rightAst.arguments[0].type == 'Identifier'
				&& rightAst.arguments[0].name == firstArgName)
			{
				result.codeStyle = 'proxyGlobalHandler';
				result.globalHandlerName = escodegen.generate(lastBodyArgument.right.callee);
				debug('get globalhandler:%s', result.globalHandlerName);
			}
			else if (rightAst.type == 'Identifier'
				&& rightAst.name == firstArgName)
			{
				result.codeStyle = 'fullHandler';
				debug('this is fullHandler');
			}
		}
	}

	if (result.handlerNameVarName
		&& ast.type == 'ExpressionStatement'
		&& ast.expression.type == 'AssignmentExpression'
		&& ast.expression.operator == '='
		&& ast.expression.left
		&& ast.expression.left.object
		&& ast.expression.left.object.name == result.handlerNameVarName
		&& ast.expression.left.property
		&& ast.expression.right)
	{
		var name = ast.expression.left.property.name;
		var initVal = ast.expression.right;
		switch(name)
		{
			// 获取版本号相关信息
			case 'V':
			case 'K':
			case '__FUNCTION_VERSION__':
			case '__FILE_KEY__':
				debug('find sys key:%s', name);
				name = {V: '__FUNCTION_VERSION__', K: '__FILE_KEY__'}[name] || name;
				result[name+'ast'] = initVal;

				if (initVal.type == 'Literal')
				{
					if (result[name]) throw new Error(name+' IS DEFINED TWICE');
					result[name] = initVal.value;
				}
				else
				{
					debug('error ast <%s>:%o', name, initVal);
					throw new Error(name+' IS NOT LITERAL');
				}
				break;


			// 获取翻译数据
			case '__TRANSLATE_JSON__':
			case 'D':
				debug('find sys key:%s', name);
				if (name == 'D') name = '__TRANSLATE_JSON__';
				result[name+'ast'] = initVal;

				if (result[name]) throw new Error(name+' IS DEFINED TWICE');
				break;
		}
	}
	else if (!result.handlerNameVarName
		&& ast.type == 'VariableDeclaration'
		&& ast.declarations
		&& ast.declarations.length)
	{
		ast.declarations.some(function(item)
		{
			if (item.init
				&& item.init.type == 'Identifier'
				&& item.init.name == result.handlerName)
			{
				result.handlerNameVarName = item.id.name;
				debug('handlerNameVarName %s', result.handlerNameVarName);
				return true;
			}
		});
	}
	else if (ast.body || ast.consequent)
	{
		var body = ast.body;
		if (!body)
		{
			body = ast.consequent.body;
		}
		else if (!_.isArray(body))
		{
			body = body.body;
		}

		if (_.isArray(body))
		{
			_.each(body, function(subAst)
			{
				if (subAst.type != 'FunctionDeclaration')
				{
					paseI18nHandlerInfo(subAst, options, result);
				}
			});
		}
		else
		{
			debug('ast has body, but not a array, type:%s ast:%o', ast.type, ast);
		}
	}


	// 由于json数据需要根据version判断使用不同的parser
	// 所以移动到第一个迭代使用
	if (isFirstDeep && result.__TRANSLATE_JSON__ast)
	{
		debug('parse __TRANSLATE_JSON__ast');
		var jsonAst = result.__TRANSLATE_JSON__ast;
		var funcVersion = result.__FUNCTION_VERSION__;
		jsonAst.toI18NJSON = function()
		{
			var json = jsoncode.getParser(funcVersion).translateAst2JSON(this);
			return new I18NJSON(json, funcVersion);
		};
		// 接入外部插件
		var emitData =
		{
			result		: undefined,
			options		: options,
			original	: jsonAst,
		};
		emitter.trigger('loadTranslateJSON', emitData);

		result.__TRANSLATE_JSON__ = emitData.result === undefined
			? jsonAst.toI18NJSON().toJSON() : emitData.result;

		// 删除toJSON，避免后续结果序列化有问题
		delete jsonAst.toI18NJSON;
	}

	return result;
}


function I18NJSON(data, funcVersion)
{
	this.data = data;
	this.funcVersion = funcVersion;
}

_.extend(I18NJSON.prototype,
{
	toJSON: function()
	{
		return this.data;
	},
});

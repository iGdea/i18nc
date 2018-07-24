'use strict';

var _			= require('lodash');
var debug		= require('debug')('i18nc-core:i18n_func_parser');
var astUtils	= require('../ast_utils');
var emitter		= require('../emitter');
var escodegen	= require('escodegen');
var exportsTest	= exports._test = {};

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

	if (!result)
	{
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

				initVal.toJSON = _translateAst2JSON;
				// 接入外部插件
				var emitData =
				{
					result		: undefined,
					options		: options,
					original	: initVal,
				};
				emitter.trigger('loadTranslateJSON', emitData);

				result[name] = emitData.result === undefined
					? initVal.toJSON() : emitData.result;
				// 删除toJSON，避免后续结果序列化有问题
				delete initVal.toJSON;

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

	return result;
}


/**
 * 将__TRANSLATE_JSON__值的ast，解成json对象
 */
function _translateAst2JSON()
{
	var ast = this;
	var result = {};

	ast.properties.forEach(function(translate_json_ast)
	{
		var lan = astUtils.ast2constVal(translate_json_ast.key);
		var lan_data = result[lan] = {}

		if (translate_json_ast.value.type != 'ObjectExpression')
		{
			debug('translate json lan <%s> value is not object: %s', lan, translate_json_ast.value.type);
			return;
		}

		translate_json_ast.value.properties.forEach(function(lan_ast)
		{
			var key = astUtils.ast2constVal(lan_ast.key);

			// 正式解析翻译数据
			switch(key)
			{
				case 'DEFAULTS':
					debug('TranslateData JSON Key <%s> begin, lan:%', key, lan);
					lan_data.DEFAULTS = _wordAst2json(lan_ast.value);
					debug('TranslateData JSON Key <%s> end, lan:%', key, lan);
					break;

				case 'SUBTYPES':
					var SUBTYPES_data = lan_data.SUBTYPES = {};

					lan_ast.value.properties.forEach(function(subtype_ast)
					{
						var subkey = astUtils.ast2constVal(subtype_ast.key);
						debug('TranslateData JSON Key <%s> begin, lan:%, subkey:%s', key, lan, subkey);
						SUBTYPES_data[subkey] = _wordAst2json(subtype_ast.value);
						debug('TranslateData JSON Key <%s> begin, lan:%, subkey:%s', key, lan, subkey);
					});
					break;

				default:
					debug('undefined TranslateData JSON Key: %s', key);

			}
		});

	});


	return result;
}



/**
 * 将ast转换成json数据
 *
 * 暴露接口仅测试使用
 */
exportsTest._wordAst2json = _wordAst2json;
function _wordAst2json(ast)
{
	var result = {};
	ast.properties.forEach(function(proto_ast)
	{
		var name = astUtils.ast2constVal(proto_ast.key);
		var val_ast = proto_ast.value;

		if (result[name])
		{
			debug('subkey defined twice, %s', name);
		}

		switch(val_ast.type)
		{
			case 'Literal':
				var val = astUtils.ast2constVal(val_ast);
				if (val)
					result[name] = val;
				else
					debug('result is empty <%s>:%s', name, val);
				break;

			case 'ArrayExpression':
				if (val_ast.elements.length)
				{
					throw new Error('TRANSLATE DATA ONLY SUPPORT EMPTY ARRAY');
				}
				result[name] = '';
				break;

			default:
				throw new Error('Error ast type for translate JSON');
		}
	});

	return result;
}

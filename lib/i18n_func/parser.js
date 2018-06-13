'use strict';

var _			= require('lodash');
var debug		= require('debug')('i18nc-core:i18n_func_parser');
var astUtils	= require('../ast_utils');
var emitter		= require('../emitter').emitter;
var exportsTest	= exports._test = {};

/**
 * 分析i18n函数，提取相关信息：
 * __FUNCTION_VERSION__
 * __FILE_KEY__
 * __TRANSLATE_JSON__
 *
 * input: test/files/casefile/i18n_handler/i18n_handler_example.json
 * output: test/files/casefile/i18n_handler/i18n_handler_example_output.json
 */
exports.parse = paseI18nHandlerInfo;
function paseI18nHandlerInfo(ast, options)
{
	if (!ast) return;

	var result = {};
	if (ast.type == 'ExpressionStatement'
		&& ast.expression.type == 'AssignmentExpression'
		&& ast.expression.operator == '='
		&& ast.expression.left
		&& ast.expression.right
		&& ast.expression.left.property)
	{
		var name = ast.expression.left.property.name;
		var initVal = ast.expression.right;
		switch(name)
		{
			// 获取版本号相关信息
			case '__FUNCTION_VERSION__':
			case '__FILE_KEY__':
				debug('find sys key:%s', name);
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
				debug('find sys key:%s', name);
				result[name+'ast'] = initVal;

				if (result[name]) throw new Error(name+' IS DEFINED TWICE');

				// 接入外部插件
				var emitData =
				{
					// 可以改写ast，后续处理以此为准
					// 注意：改写的时候，要extend一下，避免修改原始数据
					ast			: initVal,
					originalAst	: initVal,
					options		: options,
					// 直接返回json对象
					resultJSON	: null,
				};
				emitter.emit('loadTranslateJSON', emitData);

				if (emitData.resultJSON)
				{
					result[name] = emitData.resultJSON;
				}
				else
				{
					if (emitData.ast !== initVal) initVal = emitData.ast;

					if (!initVal || initVal.type != 'ObjectExpression')
					{
						debug('error ast <%s>:%o', name, initVal);
						throw new Error(name+' IS NOT OBJECT');
					}

					result[name] = _translateAst2JSON(initVal);
				}
				break;
		}
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
				_.extend(result, paseI18nHandlerInfo(subAst, options));
			});
		}
		else
		{
			debug('ast has body, but not a array, type:%s ast:%o', ast.type, ast);
		}
	}

	result.handlerName = ast.id && ast.id.name;

	return result;
}


/**
 * 将__TRANSLATE_JSON__值的ast，解成json对象
 */
function _translateAst2JSON(ast)
{
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

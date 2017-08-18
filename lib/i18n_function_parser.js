var _				= require('lodash');
var debug			= require('debug')('i18nc:i18n_function_parser');
var astUtils		= require('./ast_utils');
var ArrayPush		= Array.prototype.push;
var ArrayUnshift	= Array.prototype.unshift;


/**
 * 分析i18n函数，提取相关信息：
 * __FUNCTION_VERSION__
 * __FILE_KEY__
 * __TRANSLATE_JSON__
 * 
 * input: test/files/i18n_handler_example.json
 * output: test/files/i18n_handler_example_output.json
 */
exports.parse = paseI18nHandlerInfo;
function paseI18nHandlerInfo(ast, options)
{
	if (!ast) return;

	var result = {};
	if (ast.type == 'VariableDeclaration')
	{
		ast.declarations.forEach(function(var_ast)
		{
			if (var_ast.type != 'VariableDeclarator' || !var_ast.id || !var_ast.init) return;

			var name = var_ast.id.name;
			var initVal = var_ast.init;
			switch(name)
			{
				// 获取版本号相关信息
				case '__FUNCTION_VERSION__':
				case '__FILE_KEY__':
					debug('find sys key:%s', name);

					if (initVal.type == 'Literal')
					{
						if (result[name]) throw new Error(name+' IS DEFINED TWICE');
						result[name] = initVal.value;
					}
					else
					{
						throw new Error(name+' IS NOT LITERAL');
					}
					break;


				// 获取翻译数据
				case '__TRANSLATE_JSON__':
					debug('find sys key:%s', name);

					// 如果不是object，有可能是require外部
					// 通过options的函数处理一下
					if (initVal.type != 'ObjectExpression' && options && options.loadTranslateJsonByAst)
					{
						initVal = options.loadTranslateJsonByAst(initVal);
					}

					if (!initVal || initVal.type != 'ObjectExpression')
					{
						throw new Error(name+' IS NOT OBJECT');
					}

					if (result[name]) throw new Error(name+' IS DEFINED TWICE');

					var TRANSLATE_JSON = result[name] = {};
					initVal.properties.forEach(function(translate_json_ast)
					{
						var lan = astUtils.getConstValueFromAst(translate_json_ast.key);
						var lan_data = TRANSLATE_JSON[lan] = {}

						if (translate_json_ast.value.type != 'ObjectExpression')
						{
							debug('translate json lan <%s> value is not object: %s', key, translate_json_ast.value.type);
							return;
						}

						translate_json_ast.value.properties.forEach(function(lan_ast)
						{
							var key = astUtils.getConstValueFromAst(lan_ast.key);
							
							// 正式解析翻译数据
							switch(key)
							{
								case 'DEFAULTS':
									debug('TranslateData JSON Key <%s> begin, lan:%', key, lan);
									lan_data.DEFAULTS = _translateDataAst2json(lan_ast.value);
									debug('TranslateData JSON Key <%s> end, lan:%', key, lan);
									break;

								case 'SUBTYPES':
									var SUBTYPES_data = lan_data.SUBTYPES = {};

									lan_ast.value.properties.forEach(function(subtype_ast)
									{
										var subkey = astUtils.getConstValueFromAst(subtype_ast.key);
										debug('TranslateData JSON Key <%s> begin, lan:%, subkey:%s', key, lan, subkey);
										SUBTYPES_data[subkey] = _translateDataAst2json(subtype_ast.value);
										debug('TranslateData JSON Key <%s> begin, lan:%, subkey:%s', key, lan, subkey);
									});
									break;

								default:
									debug('undefined TranslateData JSON Key: %s', key);

							}
						});

					});
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
				_.extend(result, paseI18nHandlerInfo(subAst, options));
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
 * input: test/files/translate_data_ast.json
 * output: test/files/translate_data.json
 *
 * 暴露接口仅测试使用
 */
exports._translateDataAst2json = _translateDataAst2json;
function _translateDataAst2json(ast)
{
	var result = {};
	ast.properties.forEach(function(proto_ast)
	{
		var name = astUtils.getConstValueFromAst(proto_ast.key);
		var val_ast = proto_ast.value;

		var info = result[name];
		if (info)
		{
			debug('subkey defined twice, %s', name);
		}
		else
		{
			info = result[name] = [];
		}

		if (val_ast.type == 'Literal')
		{
			info[0] = val_ast.value;
		}
		else if (val_ast.type == 'ArrayExpression')
		{
			if (val_ast.elements.length)
			{
				throw new Error('TRANSLATE DATA ONLY SUPPORT EMPTY ARRAY');
			}

			info[0] = '';
		}
		else
		{
			ArrayPush.apply(info, _logicalJsonAst2arr(val_ast));
		}
	});

	return result;
}


/**
 * 提取ast表示的翻译数据，使用array表示
 * 
 * 注意：
 * array的顺序，第一个是最末尾的或，依次类推
 * 和写法上数序相反
 * 例如：
 * a || b || c  =>  [c, b, a]
 */
function _logicalJsonAst2arr(ast)
{
	debug('logicalJsonAst2arr, before:%o', ast);

	var result = [];
	if (ast.type != 'LogicalExpression') throw new Error('RANSLATE_JSON DATA IS NOT LOGICALEXPRESSION');
	if (ast.operator != '||') throw new Error('RANSLATE_JSON DATA OPERATOR IS NOT `OR`');

	_appendLogicalExpression(ast.left, result);
	_appendLogicalExpression(ast.right, result);

	debug('logicalJsonAst2arr, result:%o', result);

	return result;
}

function _appendLogicalExpression(ast, result)
{
	if (ast.type == 'Literal')
	{
		result.unshift(ast.value);
	}
	else if (ast.type == 'ArrayExpression')
	{
		if (ast.elements.length)
		{
			throw new Error('TRANSLATE DATA ONLY SUPPORT EMPTY ARRAY');
		}

		result.unshift('');
	}
	else
	{
		ArrayUnshift.apply(result, _logicalJsonAst2arr(ast));
	}
}


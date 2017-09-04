var _			= require('lodash');
var debug		= require('debug')('i18nc:i18n_function_parser');
var astUtils	= require('./ast_utils');
var emitter		= require('./emitter').emitter;
var ArrayPush	= Array.prototype.push;


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
						ast		: initVal,
						options	: options
					};
					emitter.emit('loadTranslateJSON', emitData);

					if (emitData.ast !== initVal) initVal = emitData.ast;

					if (!initVal || initVal.type != 'ObjectExpression')
					{
						debug('error ast <%s>:%o', name, initVal);
						throw new Error(name+' IS NOT OBJECT');
					}

					result[name] = _translateAst2JSON(initVal);
					break;
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
			debug('translate json lan <%s> value is not object: %s', key, translate_json_ast.value.type);
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
					lan_data.DEFAULTS = _translateSubtreeAst2json(lan_ast.value);
					debug('TranslateData JSON Key <%s> end, lan:%', key, lan);
					break;

				case 'SUBTYPES':
					var SUBTYPES_data = lan_data.SUBTYPES = {};

					lan_ast.value.properties.forEach(function(subtype_ast)
					{
						var subkey = astUtils.ast2constVal(subtype_ast.key);
						debug('TranslateData JSON Key <%s> begin, lan:%, subkey:%s', key, lan, subkey);
						SUBTYPES_data[subkey] = _translateSubtreeAst2json(subtype_ast.value);
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
 * input: test/files/translate_data_ast.json
 * output: test/files/translate_data.json
 *
 * 暴露接口仅测试使用
 */
exports._translateSubtreeAst2json = _translateSubtreeAst2json;
function _translateSubtreeAst2json(ast)
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
				result[name] = [val_ast.value];
				break;

			case 'ArrayExpression':
				if (val_ast.elements.length)
				{
					throw new Error('TRANSLATE DATA ONLY SUPPORT EMPTY ARRAY');
				}
				result[name] = [''];
				break;

			default:
				result[name] = _translateLogicalValAst2arrWidthClear(val_ast);
		}
	});


	return result;
}


/**
 * 同_translateLogicalValAst2arr，只是对结果进行了为空排除
 */
exports._translateLogicalValAst2arrWidthClear = _translateLogicalValAst2arrWidthClear;
function _translateLogicalValAst2arrWidthClear(ast)
{
	var result = [];

	_translateLogicalValAst2arr(ast, result);

	// 对结果进行整理
	// 去掉无用的空格
	// 数组转字符
	var keepEmpty = false;
	for(var i = result.length; i--;)
	{
		var item = result[i];
		if (!item)
		{
			if (!keepEmpty)
			{
				result.splice(i, 1);
				debug('del empty val');
			}
		}
		else
		{
			keepEmpty = true;
			if (Array.isArray(result[i]))
			{
				result[i] = ''+result[i];
			}
		}
	}

	return result;
}


/**
 * 提取ast表示的翻译数据，使用array表示
 *
 * 数据特点：
 * 全部是或操作，所以有没有()，不影响最后结果
 *
 * 注意：
 * array的顺序，第一个是最末尾的或，依次类推
 * 和写法上数序相反
 * 例如：
 * a || b || c  =>  [c, b, a]
 */
function _translateLogicalValAst2arr(ast, result)
{
	debug('translateLogicalValAst2arr, before:%o', ast);

	if (ast.type != 'LogicalExpression') throw new Error('RANSLATE_JSON DATA IS NOT LOGICALEXPRESSION');
	if (ast.operator != '||') throw new Error('RANSLATE_JSON DATA OPERATOR IS NOT `OR`');

	_appendLogicalExpression(ast.right, result);
	_appendLogicalExpression(ast.left, result);

	debug('translateLogicalValAst2arr, result:%o', result);
}

function _appendLogicalExpression(ast, result)
{
	switch(ast.type)
	{
		case 'Literal':
			result.push(ast.value);
			break;

		case 'ArrayExpression':
			if (ast.elements.length)
			{
				throw new Error('TRANSLATE DATA ONLY SUPPORT EMPTY ARRAY');
			}

			result.push([]);
			break;

		default:
			_translateLogicalValAst2arr(ast, result);
	}
}

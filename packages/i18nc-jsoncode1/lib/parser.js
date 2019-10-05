'use strict';

var debug	= require('debug')('i18nc-jsoncode:parser');
var astUtil	= require('i18nc-ast').util;

exports.translateAst2JSON = translateAst2JSON;


/**
 * 将__TRANSLATE_JSON__值的ast，解成json对象
 */
function translateAst2JSON(ast)
{
	var result = {};

	ast.properties.forEach(function(translate_json_ast)
	{
		var lan = astUtil.ast2constKey(translate_json_ast.key);
		var lan_data = result[lan] = {}

		if (translate_json_ast.value.type != 'ObjectExpression')
		{
			debug('translate json lan <%s> value is not object: %s', lan, translate_json_ast.value.type);
			return;
		}

		translate_json_ast.value.properties.forEach(function(lan_ast)
		{
			var key = astUtil.ast2constKey(lan_ast.key);

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
						var subkey = astUtil.ast2constVal(subtype_ast.key);
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

exports.codeJSON2translateJSON = function(json)
{
	return json;
};

/**
 * 将ast转换成json数据
 *
 * 暴露接口仅测试使用
 */
exports._wordAst2json = _wordAst2json;
function _wordAst2json(ast)
{
	var result = {};
	ast.properties.forEach(function(proto_ast)
	{
		var name = astUtil.ast2constVal(proto_ast.key);
		var val_ast = proto_ast.value;

		if (result[name])
		{
			debug('subkey defined twice, %s', name);
		}

		switch(val_ast.type)
		{
			case 'Literal':
				var val = astUtil.ast2constVal(val_ast);
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

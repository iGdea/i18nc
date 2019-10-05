'use strict';

var _		= require('lodash');
var debug	= require('debug')('i18nc-jsoncode:parser');
var astUtil	= require('i18nc-ast').util;

exports.translateAst2JSON = translateAst2JSON;

function translateAst2JSON(ast)
{
	return codeJSON2translateJSON(_ast2json(ast));
}


/**
 * 将__TRANSLATE_JSON__值的ast，解成json对象
 */
function _ast2json(ast)
{
	var lans = [];
	var translateJSON = {};
	var translateLansMaxLen = 0;

	ast.properties.forEach(function(translate_json_ast)
	{
		var key = astUtil.ast2constKey(translate_json_ast.key);
		var value = translate_json_ast.value;
		switch(key)
		{
			// 语言
			case '$':
				if (value.type != 'ArrayExpression')
				{
					throw new Error('LANGS KEY `$` ONLY MUST BE AN ARRAY');
				}
				lans = value.elements.map(astUtil.ast2constVal);
				break;

			// 翻译数据
			case '*':
			default:
				if (value.type != 'ObjectExpression')
				{
					if (key == '*')
						throw new Error('DEFAULT TRANSLATE JSON `*` MUST BE AN OBJECT');
					else
						throw new Error('SUBTYPE TRANSLATE JSON MUST BE AN OBJECT');
				}
				var lan_data = translateJSON[key] = {};
				value.properties.forEach(function(ast)
				{
					var word = astUtil.ast2constKey(ast.key);
					var val = ast.value;
					if (val.type != 'ArrayExpression')
					{
						debug('translate target err, word:%s ast:%o', word, val);
						throw new Error('TRANSLATE TARGET MUST BE AN ARRAY');
					}

					var targets = lan_data[word] = val.elements.map(function(ast)
					{
						// 如果是null，说明是这种写法 [,,,,1]
						if (val == null) return undefined;
						return astUtil.ast2constVal(ast);
					});

					translateLansMaxLen = Math.max(translateLansMaxLen, targets.length);
				});
		}

	});

	if (translateLansMaxLen > lans.length)
	{
		debug('lans max len:%s, lans:%o', translateLansMaxLen, lans);
		throw new Error('LANGS OVERFLOW');
	}

	if (lans.length) translateJSON.$ = lans;

	return translateJSON;
}



exports.codeJSON2translateJSON = codeJSON2translateJSON;
/**
 * 将新的数据结构转化成普通的以语言为分类的结构体
 */
function codeJSON2translateJSON(translateJSON)
{
	var result = {};
	var lans = translateJSON.$ || [];
	// 转数据结构，提速
	var translateJSON2 = Object.keys(translateJSON)
		.map(function(subtype)
		{
			if (subtype == '$') return;

			return {
				subtype: subtype,
				items: _.map(translateJSON[subtype], function(values, word)
					{
						return {word: word, values: values};
					})
			};
		});

	lans.forEach(function(lan, lanIndex)
	{
		var lan_data = result[lan] = {};

		translateJSON2.forEach(function(subtypeItem)
		{
			if (!subtypeItem) return;

			if (subtypeItem.subtype == '*')
			{
				lan_data.DEFAULTS = _getSubtypeJSON(subtypeItem, lanIndex);
			}
			else
			{
				var SUBTYPES_data = lan_data.SUBTYPES || (lan_data.SUBTYPES = {});
				SUBTYPES_data[subtypeItem.subtype] = _getSubtypeJSON(subtypeItem, lanIndex);
			}
		});
	});

	return result;
}


/**
 * 从多个语言翻译结果合并的数组中，找到对应语言的翻译数据
 * 是对一个语言包的一个subtype完整处理，不是单个词
 */
function _getSubtypeJSON(subtypeItem, lanIndex)
{
	var result = {};

	_.each(subtypeItem.items, function(item)
	{
		var target = item.values[lanIndex];
		if (target === undefined || target === null) return;

		// 如果是数字，则进行一次转化
		// 和i18n_func 中的逻辑保持一致，只转一次
		if (typeof target == 'number') target = item.values[target];

		if (target !== undefined && target !== null) result[item.word] = target;
	});

	return result;
}

'use strict';

var _					= require('lodash');
var debug				= require('debug')('i18nc-core:i18n_func_generator');
var escodegen			= require('escodegen');
var astTpl				= require('../ast_tpl');
var astUtils			= require('../ast_utils');
var optionsUtils		= require('../options');
var AST_FLAGS			= astUtils.AST_FLAGS;
var exportsTest			= exports._test = {};
var mergeTranslateData	= require('./lib/merge_translate_data');

/**
 * 获取使用的翻译数据
 *
 * input: test/files/merge_translate_data.js
 * output: test/files/output/i18n_func_generator/merge_translate_data_output.json
 */
exports.getTranslateJSON = getTranslateJSON;
function getTranslateJSON(data)
{
	var result = mergeTranslateData(data);
	result = _to_TRANSLATE_DATA_fromat(result);

	return result;
}

/**
 * 没有翻译的，生成注释
 */
exports.fillNoUsedCodeTranslateWords = fillNoUsedCodeTranslateWords;
function fillNoUsedCodeTranslateWords(translateDataJSON, codeTranslateWords)
{
	var DEFAULTS_WORDS = _.uniq(codeTranslateWords.DEFAULTS);
	if (DEFAULTS_WORDS.length)
	{
		var result = translateDataJSON['*'] || (translateDataJSON['*'] = {});
		_.each(DEFAULTS_WORDS, function(word)
		{
			if (!result[word]) result[word] = null;
		});
	}

	_.each(codeTranslateWords.SUBTYPES, function(subtype_words, subtype)
	{
		var SUBTYPE_WORDS = _.uniq(subtype_words);
		if (!SUBTYPE_WORDS.length) return;

		var result = translateDataJSON[subtype] || (translateDataJSON[subtype] = {});
		_.each(SUBTYPE_WORDS, function(word)
		{
			if (!result[word]) result[word] = null;
		});
	});
}


/**
 * 结果转code
 */
exports.genTranslateJSONCode = genTranslateJSONCode;
function genTranslateJSONCode(translateData)
{
	debug('translateData:%o', translateData);

	var ast = _translateJSON2ast(translateData);
	if (ast)
	{
		var code = escodegen.generate(ast, optionsUtils.escodegenOptions);
		code = code.replace(/,?\s*(['"])\1 *: *null/g, '');
		return code;
	}
	else
	{
		return '{}';
	}
}


/**
 * 将TRANSLATE_DATA数据，转成ast表示
 *
 * input: _to_TRANSLATE_DATA_fromat  运行结果
 * output: test/files/output/i18n_func_generator/merge_translate_data_output.json
 *
 * 对数据进行重新编排
 */
exportsTest._translateJSON2ast = _translateJSON2ast;
function _translateJSON2ast(mainData)
{
	var resultPropertiesAst = [];
	var keys = Object.keys(mainData);
	keys = _.without(keys, '$', '*').sort();
	if (mainData['*']) keys.unshift('*');

	var lans = mainData.$;
	if (lans)
	{
		var tmp = astTpl.ArrayExpression(lans.map(function(val)
		{
			return astUtils.constVal2ast(val);
		}));
		resultPropertiesAst.push(astTpl.Property('$', tmp));
	}

	_.each(keys, function(key)
	{
		resultPropertiesAst.push(astTpl.Property(key, _wordJson2ast(mainData[key])));
	});


	if (resultPropertiesAst.length)
	{
		return astTpl.ObjectExpression(resultPropertiesAst);
	}
}


/**
 * 对mergeTranslateData的结果数据进行重新编排
 * 生成TRANSLATE_DATA的数据格式
 * 同时，将重复的数据，使用index进行替换
 *
 * input: mergeTranslateData  运行结果
 * output: test/files/output/i18n_func_generator/merge_translate_data_output.json
 */
exportsTest._to_TRANSLATE_DATA_fromat = _to_TRANSLATE_DATA_fromat;
function _to_TRANSLATE_DATA_fromat(data)
{
	var result = {$: data.LANS};
	var lansMap = _getLansMap(data.LANS.sort());

	function _addkey(subtype, word, lanData)
	{
		var wordMap = {};
		_.each(Object.keys(lanData).sort(), function(lan)
		{
			var translateData = lanData[lan];
			var lanObj = result[subtype] || (result[subtype] = {});
			var wordObj = lanObj[word] || (lanObj[word] = []);
			var lanIndex = lansMap[lan];

			if (translateData in wordMap)
			{
				wordObj[lanIndex] = wordMap[translateData];
			}
			else
			{
				wordObj[lanIndex] = translateData;
				wordMap[translateData] = lanIndex;
			}
		});
	}

	_.each(data.DEFAULTS, function(lanData, word)
	{
		_addkey('*', word, lanData);
	});

	_.each(data.SUBTYPES, function(item, subtype)
	{
		_.each(item, function(lanData, word)
		{
			if (subtype == '*')
				throw new Error('`*` IS SYSTEM RESERVED FIELD');
			else if (subtype == '$')
				throw new Error('`$` IS SYSTEM RESERVED FIELD');
			else if ((''+subtype)[0] == '$')
				throw new Error('`$...` ARE SYSTEM RESERVED FIELD');

			_addkey(subtype, word, lanData);
		});
	});

	return result;
}





/**
 * 将array表示的或关系转成ast表示
 */
exportsTest._wordJson2ast = _wordJson2ast;
function _wordJson2ast(wordMap)
{
	if (!wordMap) return;
	var result = [];

	// 翻译为空的时候，把这些wordMap转化成注释
	var emptyTranslateComments = [];

	// 先对object进行排序，保证尽可能少触发svn变更
	Object.keys(wordMap).sort()
		.forEach(function(word)
		{
			var translateWords = wordMap[word];
			debug('wordJson2ast word:%s, translateWords:%o', word, translateWords);

			if (translateWords === null)
			{
				// 使用escodegen.generate替换JSON.stringify
				// JSON.stringify 会导致一些特殊字符不会encode，例如\u2029
				var keyStr = escodegen.generate(astTpl.Literal(word), optionsUtils.escodegenOptions);
				emptyTranslateComments.push(astTpl.LineComment(' '+keyStr+':'));
				return;
			}

			var valAst = translateWords.map(function(val)
			{
				if (val === undefined)
					return null;
				else if (val == '')
					return astTpl.ArrayExpression([]);
				else
					return astUtils.constVal2ast(val);
			});

			var retAst = astTpl.Property(word, astTpl.ArrayExpression(valAst));
			result.push(retAst);

			if (emptyTranslateComments.length)
			{
				retAst.leadingComments = emptyTranslateComments;
				emptyTranslateComments = [];
			}
		});

	if (emptyTranslateComments.length)
	{
		if (!result.length)
		{
			var protoKey = astTpl.Property('', astUtils.constVal2ast(null));
			astUtils.setAstFlag(protoKey, AST_FLAGS.PLACEHOLDER_WORDER);
			result.push(protoKey);
		}

		var lastItem = result[result.length-1];
		lastItem.leadingComments = (lastItem.leadingComments || []).concat(emptyTranslateComments);
	}

	return astTpl.ObjectExpression(result);
}


function _getLansMap(lans)
{
	var result = {};
	_.each(lans, function(lan, index)
	{
		result[lan] = index;
	});

	return result;
}

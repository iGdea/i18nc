'use strict';

var _					= require('lodash');
var debug				= require('debug')('i18nc-core:i18n_func_generator_v1');
var i18ncAst			= require('i18nc-ast');
var astTpl				= i18ncAst.tpl;
var astUtil				= i18ncAst.util;
var AST_FLAGS			= i18ncAst.AST_FLAGS;
var exportsTest			= exports._test = {};
var mergeTranslateData	= require('../../i18n_func/lib/merge_translate_data');

/**
 * 获取使用的翻译数据
 *
 * input: test/files/merge_translate_data.js
 * output: test/files/output/i18n_func_generator_v1/merge_translate_data_output.json
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
function fillNoUsedCodeTranslateWords(translateDataJSON, codeTranslateWords, defaultLanguage)
{
	var lans = Object.keys(translateDataJSON);
	if (!lans.length) lans = [defaultLanguage];

	var DEFAULTS_WORDS = _.uniq(codeTranslateWords.DEFAULTS);
	if (DEFAULTS_WORDS.length)
	{
		lans.forEach(function(lan)
		{
			var lanItem = translateDataJSON[lan] || (translateDataJSON[lan] = {});
			var result = lanItem.DEFAULTS || (lanItem.DEFAULTS = {});
			_.each(DEFAULTS_WORDS, function(word)
			{
				if (!result[word]) result[word] = null;
			});
		});
	}

	_.each(codeTranslateWords.SUBTYPES, function(subtype_words, subtype)
	{
		var SUBTYPE_WORDS = _.uniq(subtype_words);
		if (!SUBTYPE_WORDS.length) return;

		lans.forEach(function(lan)
		{
			var lanItem = translateDataJSON[lan] || (translateDataJSON[lan] = {});
			lanItem = lanItem.SUBTYPES || (lanItem.SUBTYPES = {});
			var result = lanItem[subtype] || (lanItem[subtype] = {});

			_.each(SUBTYPE_WORDS, function(word)
			{
				if (!result[word]) result[word] = null;
			});
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
		var code = astUtil.tocode(ast);
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
 * output: test/files/output/i18n_func_generator_v1/merge_translate_data_output.json
 *
 * 对数据进行重新编排
 */
exportsTest._translateJSON2ast = _translateJSON2ast;
function _translateJSON2ast(mainData)
{
	var resultPropertiesAst = [];

	_.each(Object.keys(mainData).sort(), function(lan)
	{
		var translateData = mainData[lan];
		var lanPropertiesAst = [];

		// 处理DEFAULTS
		var tmp = _wordJson2ast(translateData.DEFAULTS);
		if (tmp)
		{
			lanPropertiesAst.push(astTpl.Property('DEFAULTS', tmp));
		}


		// 处理 SUBTYPES
		if (translateData.SUBTYPES)
		{
			var tmpSubtypesPropertiesAst = _.map(Object.keys(translateData.SUBTYPES).sort(), function(subtype)
				{
					var tmp = _wordJson2ast(translateData.SUBTYPES[subtype]);
					if (!tmp) return;

					return astTpl.Property(subtype, tmp);
				})
				.filter(function(val)
				{
					return val;
				});

			if (tmpSubtypesPropertiesAst.length)
			{
				lanPropertiesAst.push(astTpl.Property('SUBTYPES', astTpl.ObjectExpression(tmpSubtypesPropertiesAst)));
			}
		}

		if (lanPropertiesAst.length)
		{
			resultPropertiesAst.push(astTpl.Property(lan, astTpl.ObjectExpression(lanPropertiesAst)));
		}
	});


	if (resultPropertiesAst.length)
	{
		return astTpl.ObjectExpression(resultPropertiesAst);
	}
}


/**
 * 对mergeTranslateData的结果数据进行重新编排
 * 生成TRANSLATE_DATA的数据格式
 *
 * input: mergeTranslateData  运行结果
 * output: test/files/output/i18n_func_generator_v1/merge_translate_data_output.json
 */
exportsTest._to_TRANSLATE_DATA_fromat = _to_TRANSLATE_DATA_fromat;
function _to_TRANSLATE_DATA_fromat(data)
{
	var result = {};
	_.each(data.DEFAULTS, function(lanData, word)
	{
		_.each(lanData, function(translateData, lan)
		{
			var lanObj = result[lan] || (result[lan] = {});
			var wordObj = lanObj.DEFAULTS || (lanObj.DEFAULTS = {});

			wordObj[word] = translateData;
		});
	});

	_.each(data.SUBTYPES, function(item, subtype)
	{
		_.each(item, function(lanData, word)
		{
			_.each(lanData, function(translateData, lan)
			{
				var lanObj = result[lan] || (result[lan] = {});
				var subtypeObj = lanObj.SUBTYPES || (lanObj.SUBTYPES = {});
				var wordObj = subtypeObj[subtype] || (subtypeObj[subtype] = {});

				wordObj[word] = translateData;
			});
		});
	});

	return result;
}





/**
 * 将array表示的或关系转成ast表示
 */
exportsTest._wordJson2ast = _wordJson2ast;
function _wordJson2ast(words)
{
	if (!words) return;
	var result = [];

	// 翻译为空的时候，把这些words转化成注释
	var emptyTranslateComments = [];

	// 先对object进行排序，保证尽可能少触发svn变更
	Object.keys(words).sort()
		.forEach(function(val)
		{
			var translateWord = words[val];
			debug('wordJson2ast val:%s, translateWord:%o', val, translateWord);

			if (translateWord === null)
			{
				// 使用escodegen.generate替换JSON.stringify
				// JSON.stringify 会导致一些特殊字符不会encode，例如\u2029
				var keyStr = astUtil.tocode(astTpl.Literal(val));
				emptyTranslateComments.push(astTpl.LineComment(' '+keyStr+':'));
				return;
			}

			var valAst = translateWord == ''
				? astTpl.ArrayExpression([])
				: astUtil.constVal2ast(translateWord);

			var retAst = astTpl.Property(val, valAst);
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
			var protoKey = astTpl.Property('', astUtil.constVal2ast(null));
			astUtil.setAstFlag(protoKey, AST_FLAGS.PLACEHOLDER_WORDER);
			result.push(protoKey);
		}

		var lastItem = result[result.length-1];
		lastItem.leadingComments = (lastItem.leadingComments || []).concat(emptyTranslateComments);
	}

	return astTpl.ObjectExpression(result);
}

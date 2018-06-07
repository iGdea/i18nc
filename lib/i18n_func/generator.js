'use strict';

var _				= require('lodash');
var fs				= require('fs');
var debug			= require('debug')('i18nc-core:i18n_func_generator');
var escodegen		= require('escodegen');
var astTpl			= require('../ast_tpl');
var astUtils		= require('../ast_utils');
var wordsUtils		= require('../words_utils');
var optionsUtils	= require('../options');


exports.genTranslateJSONCode = genTranslateJSONCode;
function genTranslateJSONCode(translateData)
{
	debug('translateData:%o', translateData);

	var ast = _translateJSON2ast(translateData);
	if (ast)
	{
		var myCode = escodegen.generate(ast, optionsUtils.escodegenOptions);
		return wordsUtils.unescape4escodegen(myCode);
	}
	else
	{
		return '{}';
	}
}

/**
 * 获取使用的翻译数据
 *
 * input: test/files/merge_translate_data.js
 * output: test/files/merge_translate_data_output.json
 */
exports.getTranslateJSON = getTranslateJSON;
function getTranslateJSON(data)
{
	var result = _mergeTranslateData(data);
	result = _to_TRANSLATE_DATA_fromat(result);

	return result;
}



/**
 * 将TRANSLATE_DATA数据，转成ast表示
 *
 * input: _to_TRANSLATE_DATA_fromat  运行结果
 * output: test/files/merge_translate_data.json
 *
 * 对数据进行重新编排
 * 暴露接口仅测试使用
 */
exports._translateJSON2ast = _translateJSON2ast;
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

exports.fillNoUsedCodeTranslateWords = fillNoUsedCodeTranslateWords;
function fillNoUsedCodeTranslateWords(translateDataJSON, codeTranslateWords, defaultTranslateLanguage)
{
	var lans = Object.keys(translateDataJSON);
	if (!lans.length) lans = [defaultTranslateLanguage];

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
 * 对mergeTranslateData的结果数据进行重新编排
 * 生成TRANSLATE_DATA的数据格式
 *
 * input: _mergeTranslateData  运行结果
 * output: test/files/merge_translate_data_output.json
 *
 * 暴露接口仅测试使用
 */
exports._to_TRANSLATE_DATA_fromat = _to_TRANSLATE_DATA_fromat;
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
 * 合并各个来源的数据
 * 根据参数来确定打包到code的数据
 *
 * input: test/files/merge_translate_data.js
 * output: test/files/merge_translate_data_json.json
 *
 * 暴露接口仅测试使用
 */
exports._mergeTranslateData = _mergeTranslateData;
function _mergeTranslateData(mainData)
{
	// 先用一个不规范的数据保存，最后要把语言作为一级key处理
	var result = {DEFAULTS: {}, SUBTYPES: {}};
	var codeTranslateWords = mainData.codeTranslateWords || {};
	var FILE_KEY = mainData.FILE_KEY;


	_.each(_.uniq(codeTranslateWords.DEFAULTS), function(word)
	{
		result.DEFAULTS[word] = _getOneTypeListData('DEFAULTS', word, mainData, FILE_KEY);
	});

	_.each(codeTranslateWords.SUBTYPES, function(words, subtype)
	{
		var subresult = result.SUBTYPES[subtype] = {};
		_.each(_.uniq(words), function(word)
		{
			subresult[word] = _getOneTypeListData('SUBTYPES', word, mainData, FILE_KEY, subtype);
		});
	});

	return result;
}


/**
 * 针对单个type(DEFAULTS/SUBTYPES)，单个单词的 所有语言
 * 返回其翻译结果的数组
 *
 * 处理任务
 *     db下所有文件和指定文件的两份数据融合
 *     和函数中分析出来的数据融合
 */
function _getOneTypeListData(maintype, word, mainData, FILE_KEY, subtype)
{
	var funcTranslates = {};
	var dbNormalTranslates = {};
	var dbFileKeyTranslates = {};
	var lans = {};
	var pickFileLanguages = mainData.pickFileLanguages
			&& mainData.pickFileLanguages.length
			&& mainData.pickFileLanguages;

	debug('pickFileLanguages:%o', pickFileLanguages);

	_.each(mainData.dbTranslateWords, function(lanInfo, lan)
	{
		if (!lanInfo) return;
		if (pickFileLanguages && pickFileLanguages.indexOf(lan) == -1) return;

		var subLanInfo = lanInfo['*'] && lanInfo['*'][maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];
		var translateWord = subLanInfo && subLanInfo[word];
		if (translateWord || translateWord === '')
		{
			lans[lan] = 1;
			dbNormalTranslates[lan] = translateWord;
		}

		var subLanInfo = lanInfo[FILE_KEY] && lanInfo[FILE_KEY][maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];
		var translateWord = subLanInfo && subLanInfo[word];
		if (translateWord || translateWord === '')
		{
			lans[lan] = 1;
			dbFileKeyTranslates[lan] = translateWord;
		}
	});


	_.each(mainData.funcTranslateWords, function(lanInfo, lan)
	{
		if (!lanInfo) return;
		if (pickFileLanguages && pickFileLanguages.indexOf(lan) == -1) return;

		var subLanInfo = lanInfo[maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];
		var translateWord = subLanInfo && subLanInfo[word];

		if (translateWord || translateWord === '')
		{
			lans[lan] = 1;
			funcTranslates[lan] = translateWord;
		}
	});

	var lans = Object.keys(lans);
	debug('word:%s, subtype:%s lans:%o, funcTranslates:%o, dbNormalTranslates:%o, dbFileKeyTranslates:%o',
		word, subtype, lans, funcTranslates, dbNormalTranslates, dbFileKeyTranslates);

	// 对获取到的所有数据进行合并操作
	var result = {};
	lans.forEach(function(lan)
	{
		var tmp = dbFileKeyTranslates[lan];
		if (tmp || tmp === '')
		{
			result[lan] = tmp;
			return;
		}

		var tmp = dbNormalTranslates[lan];
		if (tmp || tmp === '')
		{
			result[lan] = tmp;
			return;
		}

		var tmp = funcTranslates[lan];
		if (tmp || tmp === '')
		{
			result[lan] = tmp;
			return;
		}
	});

	return result;
}





/**
 * 将array表示的或关系转成ast表示
 *
 * 暴露接口仅测试使用
 */
exports._wordJson2ast = _wordJson2ast;
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
				var keyStr = escodegen.generate(astTpl.Literal(val), optionsUtils.escodegenOptions);
				emptyTranslateComments.push(astTpl.LineComment(' '+keyStr+':'));
				return;
			}

			var valAst = translateWord == ''
				? astTpl.ArrayExpression([])
				: astUtils.constVal2ast(translateWord);

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
			result.push(astTpl.Property('<e.g.> translate word', astUtils.constVal2ast(null)));
		}
		var lastItem = result[result.length-1];
		lastItem.leadingComments = (lastItem.leadingComments || []).concat(emptyTranslateComments);
	}

	return astTpl.ObjectExpression(result);
}

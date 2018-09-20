'use strict';

var _		= require('lodash');
var debug	= require('debug')('i18nc-core:i18n_func_merge_translate_data');


module.exports = mergeTranslateData;

/**
 * 合并各个来源的数据
 * 根据参数来确定打包到code的数据
 *
 * input: test/files/merge_translate_data.js
 * output: test/files/output/merge_translate_data/merge_translate_data.json
 */
function mergeTranslateData(mainData)
{
	// 先用一个不规范的数据保存，最后要把语言作为一级key处理
	var result = {LANS: [], DEFAULTS: {}, SUBTYPES: {}};
	var codeTranslateWords = mainData.codeTranslateWords || {};
	var FILE_KEY = mainData.FILE_KEY;
	var lans = [];


	_.each(_.uniq(codeTranslateWords.DEFAULTS), function(word)
	{
		var info = _getOneTypeListData('DEFAULTS', word, mainData, FILE_KEY);
		lans = _.union(lans, info.lans);
		result.DEFAULTS[word] = info.result;
	});

	_.each(codeTranslateWords.SUBTYPES, function(words, subtype)
	{
		var subresult = result.SUBTYPES[subtype] = {};
		_.each(_.uniq(words), function(word)
		{
			var info = _getOneTypeListData('SUBTYPES', word, mainData, FILE_KEY, subtype);
			lans = _.union(lans, info.lans);
			subresult[word] = info.result;
		});
	});

	result.LANS = lans;

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
	var onlyTheseLanguages = mainData.onlyTheseLanguages
			&& mainData.onlyTheseLanguages.length
			&& mainData.onlyTheseLanguages;

	debug('onlyTheseLanguages:%o', onlyTheseLanguages);

	_.each(mainData.dbTranslateWords, function(lanInfo, lan)
	{
		if (!lanInfo) return;
		if (onlyTheseLanguages && onlyTheseLanguages.indexOf(lan) == -1) return;

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
		if (onlyTheseLanguages && onlyTheseLanguages.indexOf(lan) == -1) return;

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

	return {
		lans: lans,
		result: result,
	};
}

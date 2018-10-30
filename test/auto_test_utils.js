'use strict';

var _		= require('lodash');
var testReq	= require('i18nc-test-req');

testReq.ROOT_PATH = __dirname + '/files/output';
exports.wrapCode4pkg = testReq.wrapCode4pkg;
exports.requireAfterWriteReal = testReq.requireAfterWriteReal;
exports.code2arr = testReq.code2arr;
exports.isBuild = testReq.isBuild;
exports.requireAfterWrite = testReq;

exports.JsonOfI18ncRet = function JsonOfI18ncRet(info)
{
	var obj = _.extend({}, info.words.toJSON(),
		{
			currentFileKey				: info.currentFileKey,
			originalFileKeys			: info.originalFileKeys,
			newWord4codeTranslateWords	: info.words.codeTranslateWords.list4newWords(),
			subScopeDatas				: _.map(info.subScopeDatas, exports.JsonOfI18ncRet),
		});

	var result = {};

	Object.keys(obj).sort().forEach(function(key)
	{
		result[key] = obj[key];
	});

	return JSON.parse(JSON.stringify(result));
}

exports.getCodeTranslateAllWords = function getCodeTranslateAllWords(info)
{
	var translateWords = info.words.codeTranslateWords.allwords();
	info.subScopeDatas.forEach(function(info)
	{
		translateWords = translateWords.concat(exports.getCodeTranslateAllWords(info));
	});

	return _.uniq(translateWords).sort();
}

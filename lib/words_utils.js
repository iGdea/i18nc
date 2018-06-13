'use strict';

var debug			= require('debug')('i18nc-core:words_utils');
var emitter			= require('./emitter');

exports.splitValue2lineStrings = splitValue2lineStrings;

function splitValue2lineStrings(value, type, options)
{
	// 正则说明
	// 必须要有非accii之外的字符（比如：中文）
	// 同时包含非html标签的其他字符
	var lineStrings = [];
	var cutWordReg = options.cutWordReg;

	if (cutWordReg instanceof RegExp)
	{
		var splitTranslateWordArr = value.split(cutWordReg);
		if (splitTranslateWordArr.length > 1)
		{
			// 必然比splitTranslateWordArr少一个
			value.match(cutWordReg).forEach(function(val, index)
			{
				lineStrings.push(
					{translateWord: false, ignore: false, disconnected: false, value: splitTranslateWordArr[index]},
					{translateWord: true, ignore: false, disconnected: false, value: val}
				);
			});

			lineStrings.push({translateWord: false, ignore: false, disconnected: false, value: splitTranslateWordArr.pop()});
		}
	}

	if (!lineStrings.length)
	{
		lineStrings.push({translateWord: false, ignore: false, disconnected: false, value: value});
	}

	var emitData =
	{
		value				: value,
		type				: type,
		options				: options,
		originalLineStrings	: lineStrings,
		lineStrings			: lineStrings,
	};
	emitter.trigger('cutWord', emitData);

	lineStrings = emitData.lineStrings;
	if (!lineStrings || !lineStrings.length) return;
	// 如果结果全部是不需要翻译的，也忽略
	if (!lineStrings.some(function(item){return item.translateWord && !item.ignore}))
	{
		debug('ignore no translateWord of lineStrings:%o', lineStrings);
		return;
	}

	return lineStrings;
}

exports.getTranslateWordsFromLineStrings = getTranslateWordsFromLineStrings;
function getTranslateWordsFromLineStrings(lineStrings)
{
	var translateWords = [];
	lineStrings.forEach(function(item)
	{
		if (item.translateWord && !item.ignore)
		{
			translateWords.push(item.value);
		}
	});

	return translateWords;
}

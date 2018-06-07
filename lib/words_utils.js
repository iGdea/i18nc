'use strict';

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:words_utils');
var emitter			= require('./emitter').emitter;
var cutwordBeautify	= require('./plugins/cutword_beautify/cutword_beautify');

exports.splitValue2lineStrings = splitValue2lineStrings;

function splitValue2lineStrings(value, cutWordBeautify, options)
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

	// 对分词进行美化
	if (cutWordBeautify)
	{
		if (options.cutWordBeautify.RemoveTplComment)
			lineStrings = cutwordBeautify.removeTplComment(lineStrings, value);
		if (options.cutWordBeautify.SplitByEndSymbol)
			lineStrings = cutwordBeautify.splitByEndSymbol(lineStrings, options);
		if (options.cutWordBeautify.KeyTrim)
			lineStrings = cutwordBeautify.keyTrim(lineStrings);
	}

	var emitData =
	{
		value				: value,
		options				: options,
		originalLineStrings	: lineStrings,
		lineStrings			: lineStrings,
	};
	emitter.emit('cutword', emitData);

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


exports.unescape4escodegen = (function()
{
	// 这些字符，在escodegen关闭escapeless的时候，会被转移成\u 模式
	// 需要对这些进行反转
	// 由于转换后有\u，除了注释，必须保存在字符串中
	// 所以可以直接对结果进行反转
	var charNotEspace = '，。…！；‘’“”：？—《》、|「」（）·￥×—【】';
	var regstr = [];
	var replaceMap = {};
	charNotEspace.split('').forEach(function(char)
	{
		// escodegen 使用的是大写
		// https://github.com/estools/escodegen/blob/master/escodegen.js#L394
		var hex = char.charCodeAt(0).toString(16).toUpperCase();
		var key1 = '\\u'+'0000'.slice(hex.length)+hex;
		var key2 = '\\x'+'00'.slice(hex.length)+hex;

		regstr.push('\\'+key1, '\\'+key2);
		replaceMap[key1] = char;
		replaceMap[key2] = char;
	});

	var charNotEspace = new RegExp(regstr.join('|'), 'g');
	var charNotEspaceHanlder = function(key)
	{
		return replaceMap[key] || key;
	}

	return function unescape4escodegen(code)
	{
		return code.replace(charNotEspace, charNotEspaceHanlder);
	}
})();

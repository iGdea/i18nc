'use strict';

var debug	 	= require('debug')('i18nc-jsoncode');
var jsoncode1	= require('i18nc-jsoncode1');
var jsoncode2	= require('i18nc-jsoncode2');


exports.jsoncode =
{
	v1: jsoncode1,
	v2: jsoncode2
};

exports.getParser = function(funcVersion)
{
	if (!funcVersion || !ltI18NFuncVersion(funcVersion, 'G'))
	{
		debug('use parser v2');
		return jsoncode2.parser;
	}
	else
	{
		debug('use parser v1');
		return jsoncode1.parser;
	}
};

exports.getGenerator = function(funcVersion)
{
	if (!funcVersion || !ltI18NFuncVersion(funcVersion, 'G'))
	{
		debug('use generator v2');
		return jsoncode2.generator;
	}
	else
	{
		debug('use generator v1');
		return jsoncode1.generator;
	}
};


// 判断两个版本号，是否是小于关系
// 由于一开始做的版本，先使用了小写字母，导致charCode转化有问题
// 这里先转成大写进行判断，等到后面大写用完之后，再去掉toUpperCase
function ltI18NFuncVersion(a, b)
{
	return a.toUpperCase().charCodeAt(0) < b.toUpperCase().charCodeAt(0);
}

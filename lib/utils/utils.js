'use strict';


// 判断两个版本号，是否是小于关系
// 由于一开始做的版本，先使用了小写字母，导致charCode转化有问题
// 这里先转成大写进行判断，等到后面大写用完之后，再去掉toUpperCase
exports.ltI18NFuncVersion = function(a, b)
{
	return a.toUpperCase().charCodeAt(0) < b.toUpperCase().charCodeAt(0);
};

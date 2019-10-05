'use strict';

var _ = require('lodash');
var testExports = (exports._test = {});

exports.req = function(req, curlans)
{
	var lansHeader = req.headers['accept-language'];
	return lansHeader && _.uniq(_getReqLan(lansHeader, curlans)) || [];
};

exports.req4cn = function(req)
{
	var lansHeader = req.headers['accept-language'];
	return lansHeader && _.uniq(_getReqLan4cn(lansHeader)) || [];
};

exports.filter = function(lans, onlyList)
{
	var onlyLansList = [];
	var onlyPrevList = [];

	onlyList.forEach(function(name)
	{
		if (name.length == 2 || name.indexOf('-') == -1)
		{
			onlyPrevList.push(name);
		}
		else
		{
			onlyLansList.push(name);
		}
	});

	if (!onlyLansList.length) onlyLansList = null;
	if (!onlyPrevList.length) onlyPrevList = null;

	return lans.filter(function(name)
	{
		return (onlyLansList && onlyLansList.indexOf(name) != -1)
			|| (onlyPrevList && onlyPrevList.indexOf(name.split('-')[0]) != -1);
	});
};


testExports._getReqLan = _getReqLan;
function _getReqLan(lansHeader, curlans)
{
	var lanstr = [];
	lansHeader.toLowerCase().split(',')
		.map(function(item, index)
		{
			var arr = item.split(';');
			var q = arr[1];
			var qval = q && q.substr(0, 2) == 'q=' && +q.substr(2);

			return {
				val		: arr[0],
				q		: qval,
				index	: index
			};
		})
		.sort(function(a, b)
		{
			if (!a.q && !b.q) return a.index > b.index ? -1 : 1;
			if (!a.q) return -1;
			if (!b.q) return 1;

			if (a.q == b.q) return a.index > b.index ? -1 : 1;

			return a.q > b.q ? -1 : 1;
		})
		.some(function(item)
		{
			var val = item.val;
			if (curlans.indexOf(val) != -1) return true;
			lanstr.push(val);
		});

	return lanstr;
}


testExports._getReqLan4cn = _getReqLan4cn;
function _getReqLan4cn(lansHeader)
{
	var lans = _getReqLan(lansHeader, ['zh-cn', 'zh']);

	if (lans.length)
	{
		var needCHT = false;
		var needEn = false;
		var chtFirst = true;
		lans.some(function(name)
		{
			if (name == 'zh-cn') return;

			if (name.length == 2)
			{
				if (name == 'en') needEn = false;
			}
			else
			{
				var prevKey = name.substr(0, 3);
				if (prevKey == 'en-')
				{
					needEn = true;
					chtFirst = needCHT;
				}
				else if (prevKey == 'zh-')
				{
					needCHT = true;
					chtFirst = !needEn;
				}
			}
		});

		if (needCHT && chtFirst) lans.push('cht');
		if (needEn) lans.push('en');
		if (needCHT && !chtFirst) lans.push('cht');
	}

	return lans;
}

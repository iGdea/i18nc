'use strict';

const _ = require('lodash');
const testExports = (exports._test = {});

exports.req = function(req, curlans) {
	const lansHeader = req.headers['accept-language'];
	return (lansHeader && _.uniq(_getReqLan(lansHeader, curlans))) || [];
};

exports.req4cn = function(req) {
	const lansHeader = req.headers['accept-language'];
	return (lansHeader && _.uniq(_getReqLan4cn(lansHeader))) || [];
};

exports.filter = function(lans, onlyList) {
	let onlyLansList = [];
	let onlyPrevList = [];

	onlyList.forEach(function(name) {
		if (name.length == 2 || name.indexOf('-') == -1) {
			onlyPrevList.push(name);
		} else {
			onlyLansList.push(name);
		}
	});

	if (!onlyLansList.length) onlyLansList = null;
	if (!onlyPrevList.length) onlyPrevList = null;

	return lans.filter(function(name) {
		return (
			(onlyLansList && onlyLansList.indexOf(name) != -1) ||
			(onlyPrevList && onlyPrevList.indexOf(name.split('-')[0]) != -1)
		);
	});
};

testExports._getReqLan = _getReqLan;
function _getReqLan(lansHeader, curlans) {
	const lanstr = [];
	lansHeader
		.toLowerCase()
		.split(',')
		.map(function(item, index) {
			const arr = item.split(';');
			const q = arr[1];
			const qval = q && q.substr(0, 2) == 'q=' && +q.substr(2);

			return {
				val: arr[0],
				q: qval,
				index: index
			};
		})
		.sort(function(a, b) {
			if (!a.q && !b.q) return a.index > b.index ? -1 : 1;
			if (!a.q) return -1;
			if (!b.q) return 1;

			if (a.q == b.q) return a.index > b.index ? -1 : 1;

			return a.q > b.q ? -1 : 1;
		})
		.some(function(item) {
			const val = item.val;
			if (curlans.indexOf(val) != -1) return true;
			lanstr.push(val);
		});

	return lanstr;
}

testExports._getReqLan4cn = _getReqLan4cn;
function _getReqLan4cn(lansHeader) {
	const lans = _getReqLan(lansHeader, ['zh-cn', 'zh']);

	if (lans.length) {
		let needCHT = false;
		let needEn = false;
		let chtFirst = true;
		lans.some(function(name) {
			if (name == 'zh-cn') return;

			if (name.length == 2) {
				if (name == 'en') needEn = false;
			} else {
				const prevKey = name.substr(0, 3);
				if (prevKey == 'en-') {
					needEn = true;
					chtFirst = needCHT;
				} else if (prevKey == 'zh-') {
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

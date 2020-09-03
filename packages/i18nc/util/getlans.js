'use strict';

const _ = require('lodash');
const testExports = (exports._test = {});

exports.req = function(req, curlans) {
	const lansHeader = req.headers['accept-language'];
	return (lansHeader && _.uniq(_getReqLan(lansHeader, curlans))) || [];
};

exports.req4cn = function(req) {
	const lansHeader = req.headers['accept-language'];
	if (!lansHeader) {
		return ['zh-cn'];
	}
	return (lansHeader && _.uniq(_getReqLan4cn(lansHeader))) || [];
};

exports.filter = function(lans, onlyList) {
	// 原来的语言判断太复杂，这里做了很简单的判断
	let filterLan = 'en'; // 默认英文，比如日语、韩语，统统显示英文
	let pickLan = lans && lans[0];
	if (lans && lans.length > 0) {
		lans.some(function(lan) {
			const findIndex = _.findIndex(onlyList, function(onlyLan) {
				return lan.indexOf(onlyLan) > -1
			});
			if (findIndex > -1) {
				filterLan = onlyList[findIndex];
				pickLan = lan;
				return true;
			}
		})
	}
	// 对于中文做特殊处理
	if (pickLan.indexOf('zh') > -1) {
		// 保守起见，暂时只判断zh-HK和zh-TW使用繁体
		// 事实上只有zh-cn和zh-hans这两种使用简体，其余一律用繁体
		pickLan = pickLan.toLowerCase();
		if (pickLan === 'zh-hk' || pickLan === 'zh-tw') {
			filterLan = 'cht';
		}
	}
	return filterLan;
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
	const lans = _getReqLan(lansHeader, []);
	return lans;
}

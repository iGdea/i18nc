/* global $I18N_getLanguageCode */
/* eslint-disable no-var */

'use strict';

module.exports = function $handlerName(
	msg,
	args,
	translateJSON,
	fileKey,
	data,
	handler
) {
	if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

	var self = handler,
		tpldata = args[1],
		subkey = args[2],
		replace_index = 0,
		options = {},
		lanIndexArr,
		i,
		lanIndex,
		msgResult,
		translateValues;

	if (!tpldata || !tpldata.join) {
		subkey = tpldata;
		tpldata = [];
	}

	if (subkey && typeof subkey == 'object') {
		options = subkey;
		subkey = options.subkey;
	}

	var LAN = options.language || $I18N_getLanguageCode(data);

	if (LAN && LAN.split) {
		if (self.L != LAN) {
			var dblans = translateJSON.$ || [],
				dblansMap = {},
				lanKeys = LAN.split(',');
			lanIndexArr = self.M = [];

			for (i = dblans.length; i--; ) dblansMap[dblans[i]] = i;

			for (i = lanKeys.length; i--; ) {
				lanIndex = dblansMap[lanKeys[i]];
				if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.L = LAN;
		}

		lanIndexArr = self.M;
		var _getVaule = function(subkey) {
			translateValues =
				translateJSON[subkey] && translateJSON[subkey][msg];
			if (translateValues) {
				msgResult = translateValues[lanIndex];
				if (typeof msgResult == 'number')
					msgResult = translateValues[msgResult];
			}
		};

		for (i = lanIndexArr.length; !msgResult && i--; ) {
			lanIndex = lanIndexArr[i];
			if (subkey) _getVaule(subkey);
			if (!msgResult) _getVaule('*');
		}

		if (msgResult) msg = msgResult;
	}

	msg += '';
	// 判断是否需要替换：不需要替换，直接返回
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg
		.replace(/%\{(\d+)\}/g, function(all, index) {
			var newVal = tpldata[+index];
			return newVal === undefined ? '' : newVal;
		})
		.replace(/%s|%p|%\{.+?\}/g, function() {
			var newVal = tpldata[replace_index++];
			return newVal === undefined ? '' : newVal;
		});
};

/* global $getLanguageCode $TRANSLATE_JSON_CODE */
/* eslint-disable no-var */

'use strict';

module.exports = function $handlerName(msg, tpldata, subkey) {
	if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

	var self = $handlerName,
		data = self.$ || (self.$ = {}),
		translateJSON,
		replace_index = 0,
		options = {},
		lanIndexArr,
		i,
		lanIndex,
		translateMsg,
		translateValues;

	if (!tpldata || !tpldata.join) {
		subkey = tpldata;
		tpldata = [];
	}

	if (subkey && typeof subkey == 'object') {
		options = subkey;
		subkey = options.subkey;
	}

	var LAN = options.language || $getLanguageCode(data);

	if (LAN && LAN.split) {
		if (self.L != LAN) {
			// K: __FILE_KEY__
			// V: __FUNCTION_VERSION__
			// D: __TRANSLATE_JSON__
			self.K = '$FILE_KEY';
			self.V = '$FUNCTION_VERSION';
			self.D = $TRANSLATE_JSON_CODE;
			translateJSON = self.D;

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
		translateJSON = self.D;
		var _getVaule = function(subkey) {
			translateValues =
				translateJSON[subkey] && translateJSON[subkey][msg];
			if (translateValues) {
				translateMsg = translateValues[lanIndex];
				if (typeof translateMsg == 'number')
					translateMsg = translateValues[translateMsg];
			}
		};
		for (i = lanIndexArr.length; !translateMsg && i--; ) {
			lanIndex = lanIndexArr[i];
			if (subkey) _getVaule(subkey);
			if (!translateMsg) _getVaule('*');
		}

		if (translateMsg) {
			msg = translateMsg;
		} else if (options.forceMatch) {
			return '';
		}
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

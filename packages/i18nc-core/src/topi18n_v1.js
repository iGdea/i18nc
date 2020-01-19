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
		lanArr,
		lanKeys,
		i,
		lanItem,
		translateMsg,
		subkeyJSON;

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
			lanKeys = LAN.split(',');
			lanArr = self.M = [];
			for (i = lanKeys.length; i--; ) {
				lanItem = translateJSON[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.L = LAN;
		}

		lanArr = self.M;
		for (i = lanArr.length; !translateMsg && i--; ) {
			lanItem = lanArr[i];
			if (subkey) {
				subkeyJSON = lanItem.SUBKEYS;
				subkeyJSON = subkeyJSON && subkeyJSON[subkey];
				translateMsg = subkeyJSON && subkeyJSON[msg];
			}

			if (!translateMsg) {
				subkeyJSON = lanItem.DEFAULTS;
				translateMsg = subkeyJSON && subkeyJSON[msg];
			}
		}

		if (translateMsg) msg = translateMsg;
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

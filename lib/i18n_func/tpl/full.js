/* global $getLanguageCode $TRANSLATE_JSON_CODE */

'use strict';

module.exports = function $handlerName(msg, tpldata, subtype)
{
	var self = $handlerName,
		data = self.$ || (self.$ = {}),
		translateJSON,
		replace_index = 0,
		lanIndexArr, i, lanIndex, msgResult, translateValues,
		LAN = $getLanguageCode(data);

	if (!tpldata || !tpldata.join) {
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split) {
		if (self.L != LAN) {
			// K: __FILE_KEY__
			// V: __FUNCTION_VERSION__
			// D: __TRANSLATE_JSON__
			self.K = '$FILE_KEY';
			self.V = '$FUNCTION_VERSION';
			self.D = $TRANSLATE_JSON_CODE;
			// 很少遇到LAN切换，没必要为了低概率增加一个if
			// if (!self.D) self.D = $TRANSLATE_JSON_CODE;
			translateJSON = self.D;

			var dblans = translateJSON.$,
				dblansMap = {},
				lanKeys = LAN.split(',');
			lanIndexArr = self.M = [];
			for(i = dblans.length; i--;) dblansMap[dblans[i]] = i;
			for(i = lanKeys.length; i--;) {
				lanIndex = dblansMap[lanKeys[i]];
				if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.L = LAN;
		}

		lanIndexArr = self.M;
		translateJSON = self.D;
		var _getVaule = function(subtype) {
			translateValues = translateJSON[subtype] && translateJSON[subtype][msg];
			if (translateValues) {
				msgResult = translateValues[lanIndex];
				if (typeof msgResult == 'number') msgResult = translateValues[msgResult];
			}
		};
		for(i = lanIndexArr.length; !msgResult && i--;) {
			lanIndex = lanIndexArr[i];
			if (subtype) _getVaule(subtype);
			if (!msgResult) _getVaule('*');
		}

		if (msgResult) msg = msgResult;
	}

	msg += '';
	// 判断是否需要替换：不需要替换，直接返回
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg.replace(/%s|%\{.+?\}/g, function(all) {
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? all : newVal === null ? '' : newVal;
	});
}

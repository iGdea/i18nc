/* global $I18N_getLanguageCode */

'use strict';

module.exports = function $handlerName(msg, args, translateJSON, fileKey, data, handler)
{
	var self = handler,
		tpldata = args[1],
		subtype = args[2],
		replace_index = 0,
		lanIndexArr, i, lanIndex, msgResult, translateValues,
		LAN = $I18N_getLanguageCode(data);

	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		if (self.L != LAN)
		{
			var dblans = translateJSON.$ || [],
				dblansMap = {},
				lanKeys = LAN.split(',');
			lanIndexArr = self.M = [];
			for(i = dblans.length; i--;)
			{
				dblansMap[dblans[i]] = i;
			}
			for(i = lanKeys.length; i--;)
			{
				lanIndex = dblansMap[lanKeys[i]];
				if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.L = LAN;
		}

		lanIndexArr = self.M;
		var _getVaule = function(subtype)
		{
			translateValues = translateJSON[subtype] && translateJSON[subtype][msg];
			if (translateValues)
			{
				msgResult = translateValues[lanIndex];
				if (typeof msgResult == 'number') msgResult = translateValues[msgResult];
			}
		};
		for(i = lanIndexArr.length; !msgResult && i--;)
		{
			lanIndex = lanIndexArr[i];
			if (subtype) _getVaule(subtype);
			if (!msgResult) _getVaule('*');
		}

		if (msgResult) msg = msgResult;
	}

	msg += '';
	// 判断是否需要替换：不需要替换，直接返回
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg.replace(/%s|%p|%\{.+?\}/g, function()
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? '' : newVal;
	});
}

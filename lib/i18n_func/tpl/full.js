/* global $getLanguageCode $TRANSLATE_JSON_CODE */

'use strict';

module.exports = function $handlerName(msg, tpldata, subtype)
{
	var self = $handlerName,
		translateJSON,
		replace_index = 0,
		lanArr, lanKeys, i, lanItem, translateMsg, subtypeJSON,
		data = self.$ || (self.$ = {}),
		LAN = $getLanguageCode(data);

	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		if (self.L != LAN)
		{
			// K: __FILE_KEY__
			// V: __FUNCTION_VERSION__
			// D: __TRANSLATE_JSON__
			self.K = '$FILE_KEY';
			self.V = '$FUNCTION_VERSION';
			self.D = $TRANSLATE_JSON_CODE;
			// 很少遇到LAN切换，没必要为了低概率增加一个if
			// if (!self.D) self.D = $TRANSLATE_JSON_CODE;

			translateJSON = self.D;
			lanKeys = LAN.split(',');

			lanArr = self.M = [];
			for(i = lanKeys.length; i--;)
			{
				lanItem = translateJSON[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.L = LAN;
		}

		lanArr = self.M;
		for(i = lanArr.length; !translateMsg && i--;)
		{
			lanItem = lanArr[i];
			if (subtype)
			{
				subtypeJSON = lanItem.SUBTYPES;
				subtypeJSON = subtypeJSON && subtypeJSON[subtype];
				translateMsg = subtypeJSON && subtypeJSON[msg];
			}
			if (!translateMsg)
			{
				subtypeJSON = lanItem.DEFAULTS;
				translateMsg = subtypeJSON && subtypeJSON[msg];
			}
		}

		if (translateMsg) msg = translateMsg;
	}

	msg += '';
	// 判断是否需要替换：不需要替换，直接返回
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg.replace(/%s|%\{.+?\}/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? all : newVal === null ? '' : newVal;
	});
}

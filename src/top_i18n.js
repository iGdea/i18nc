/* global $I18N_getLanguageCode */

'use strict';

module.exports = function topI18N(msg, args, translateJSON, fileKey, data, handler)
{
	var self = handler;
	// 使用的时候，需要替换此变量，或者全局申明此方法
	var LAN = $I18N_getLanguageCode(data);
	var tpldata = args[1];
	var subtype = args[2];
	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		var lanArr, i, len, lanItem;
		if (self.L != LAN)
		{
			var lanKeys = LAN.split(',');
			lanArr = self.M = [];
			for(i = 0, len = lanKeys.length; i < len; i++)
			{
				lanItem = translateJSON[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.L = LAN;
		}

		lanArr = self.M;
		var resultDefault, resultSubject, allsubtypes, alldefaults, subtypeJSON;
		for(i = 0, len = lanArr.length; i < len; i++)
		{
			lanItem = lanArr[i];
			if (subtype)
			{
				allsubtypes = lanItem.SUBTYPES;
				subtypeJSON = allsubtypes && allsubtypes[subtype];
				resultSubject = subtypeJSON && subtypeJSON[msg];
				if (resultSubject) break;
			}
			// default 不能使用break，有可能后面的lan有resultSubject
			if (!resultDefault)
			{
				alldefaults = lanItem.DEFAULTS;
				resultDefault = alldefaults && alldefaults[msg];
			}
		}

		if (resultSubject) msg = resultSubject;
		else if (resultDefault) msg = resultDefault;
	}

	msg += '';
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	var replace_index = 0;
	return msg.replace(/%s|%\{.+?\}/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

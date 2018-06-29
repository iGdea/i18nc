module.exports = function $handlerName(msg, tpldata, subtype)
{
	var self = $handlerName;
	var data = self.$ || (self.$ = {});
	var LAN = $GetLanguageCode(data);
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
			// K: __FILE_KEY__
			// V: __FUNCTION_VERSION__
			// D: __TRANSLATE_JSON__
			self.K = "$FILE_KEY";
			self.V = "$FUNCTION_VERSION";
			self.D = $TRANSLATE_JSON_CODE;
			// 很少遇到LAN切换，没必要为了低概率增加一个if
			// if (!self.D) self.D = $TRANSLATE_JSON_CODE;

			var __TRANSLATE_JSON__ = self.D;
			var lanKeys = LAN.split(',');
			lanArr = self.M = [];
			for(i = 0, len = lanKeys.length; i < len; i++)
			{
				lanItem = __TRANSLATE_JSON__[lanKeys[i]];
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

	// 不需要替换，直接返回
	if (!tpldata.length) return ''+msg;

	var replace_index = 0;
	return (''+msg).replace(/(%s)|(%\{(.+?)\})/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

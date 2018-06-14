function $handlerName(msg, tpldata, subtype)
{
	var self = $handlerName;
	var data = self.data || (self.data = {});
	var LAN = $GetLanguageCode(data);
	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		var lanArr, i, len, lanItem;
		if (self.__TRANSLATE_LAN__ != LAN)
		{
			self.__FILE_KEY__ = "$FILE_KEY";
			self.__FUNCTION_VERSION__ = "$FUNCTION_VERSION";
			self.__TRANSLATE_JSON__ = $TRANSLATE_JSON_CODE;

			var __TRANSLATE_JSON__ = self.__TRANSLATE_JSON__;
			var lanKeys = LAN.split(',');
			lanArr = self.__TRANSLATE_ITEMS__ = [];
			for(i = 0, len = lanKeys.length; i < len; i++)
			{
				lanItem = __TRANSLATE_JSON__[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.__TRANSLATE_LAN__ = LAN;
		}

		lanArr = self.__TRANSLATE_ITEMS__;
		var subtypeJSON, resultDefault, resultSubject;
		for(i = 0, len = lanArr.length; i < len; i++)
		{
			lanItem = lanArr[i];
			subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];
			resultSubject = subtypeJSON && subtypeJSON[msg];
			if (resultSubject) break;
			// default 不能使用break，有可能后面的lan有resultSubject
			if (!resultDefault) resultDefault = lanItem.DEFAULTS && lanItem.DEFAULTS[msg];
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

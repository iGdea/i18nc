function $handlerName(msg, tpldata, subtype)
{
	$func_header
	var self = $handlerName;
	var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = $GetGlobalCode) || {};
	var LAN = GLOBAL.$LanguageVarName;
	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN)
	{
		if (self.__TRANSLATE_LAN__ != LAN)
		{
			self.__FILE_KEY__ = "$FILE_KEY";
			self.__FUNCTION_VERSION__ = "$FUNCTION_VERSION";
			self.__TRANSLATE_JSON__ = $TRANSLATE_JSON_CODE;

			var __TRANSLATE_JSON__ = self.__TRANSLATE_JSON__;
			var lanArr = self.__TRANSLATE_ITEMS__ = [];
			if (LAN.split)
			{
				var lanKeys = LAN.split(',');
				for(var i = 0, len = lanKeys.length; i < len; i++)
				{
					var lanItem = __TRANSLATE_JSON__[lanKeys[i]];
					if (lanItem) lanArr.push(lanItem);
				}
			}
			// 放到最后，防止前面代码出错，导致if逻辑被保存
			self.__TRANSLATE_LAN__ = LAN;
		}

		var lanArr = self.__TRANSLATE_ITEMS__;
		var resultDefault, resultSubject;
		for(var i = 0, len = lanArr.length; i < len; i++)
		{
			var lanItem = lanArr[i];
			var subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];
			resultSubject = subtypeJSON && subtypeJSON[msg];
			if (resultSubject) break;
			if (!resultDefault) resultDefault = lanItem.DEFAULTS && lanItem.DEFAULTS[msg];
		}

		var result = resultSubject || resultDefault;
		if (result) msg = result;
	}

	var replace_index = 0;
	return (''+msg).replace(/(%s)|(%\{(.+?)\})/g, function()
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? '' : newVal;
	});
	$func_footer
}

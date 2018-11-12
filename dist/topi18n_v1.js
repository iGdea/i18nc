;(function (handler)
{
	if (typeof define == 'function')
		define(handler);
	else if (typeof module != 'undefined' && exports != 'undefined' && module.exports === exports)
		handler(null, exports);
	else
		handler(null, this);
})
(function(r, ctx)
{
	function topI18N(msg, args, translateJSON, fileKey, data, handler)
	{
		var self = handler,
			tpldata = args[1],
			subtype = args[2],
			replace_index = 0,
			lanArr, lanKeys, i, lanItem, translateMsg, subtypeJSON,
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
	
		return msg.replace(/%s|%p|%\{.+?\}/g, function()
		{
			var newVal = tpldata[replace_index++];
			return newVal === undefined ? '' : newVal;
		});
	}

	ctx.topI18N = topI18N;
});

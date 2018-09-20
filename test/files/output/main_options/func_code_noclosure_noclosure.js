module.exports = function textWrapCode(){




/* eslint-disable */
function I18N(msg, tpldata, subtype)
{
	var self = I18N,
		translateJSON,
		replace_index = 0,
		lanArr, lanKeys, i, lanItem, translateMsg, subtypeJSON,
		data = self.$ || (self.$ = {}),
		LAN = (function(cache)
		{
			if (!cache.global)
			{
				cache.global = (typeof window == 'object' && window)
					|| (typeof global == 'object' && global)
					|| {};
			}
		
			return cache.global.__i18n_lan__;
		})(data);

	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		if (self.L != LAN)
		{
			self.K = '*';
			self.V = 'df';
			self.D = {
				'en-US': {
					'DEFAULTS': {
						// '中文':
					}
				}
			};

			translateJSON = self.D;
			lanKeys = LAN.split(',');

			lanArr = self.M = [];
			for(i = lanKeys.length; i--;)
			{
				lanItem = translateJSON[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
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
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg.replace(/%s|%\{.+?\}/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? all : newVal === null ? '' : newVal;
	});
}
/* eslint-enable */


var words = I18N('中文')

}

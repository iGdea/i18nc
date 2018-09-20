module.exports = I18N;
function I18N(msg, tpldata, subtype)
{
	var self = I18N,
		translateJSON,
		replace_index = 0,
		lanArr, lanKeys, i, lanItem, translateMsg, subtypeJSON,
		data = self.$ || (self.$ = {}),
		LAN = (function(){return global.__i18n_lan__})(data);

	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		if (self.L != LAN)
		{
			self.K = 'i18n_handler_example';
			self.V = 'df';
			self.D = {
				"en-US": {
					"DEFAULTS": {
						"简体": "simplified",
						"空白": [],
						"无": "",
						"%s美好%s生活": "%sgood%s life",
						"%{中文}词典": "%{Chinese} dictionary"
					},
					"SUBTYPES": {
						"subtype": {
							"简体": "simplified subtype"
						}
					}
				},
				"zh-TW": {
					"DEFAULTS": {
						"简体": "簡體",
						"无": "無"
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
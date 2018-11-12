module.exports = function code()
{


	/* eslint-disable */
	function I18N(msg, tpldata, subtype)
	{
		var self = I18N,
			data = self.$ || (self.$ = {}),
			translateJSON,
			replace_index = 0,
			lanIndexArr, i, lanIndex, msgResult, translateValues,
			LAN = (function(cache) {
				if (!cache.global) {
					cache.global = (typeof window == 'object' && window)
						|| (typeof global == 'object' && global)
						|| {};
				}
		
				return cache.global.__i18n_lan__;
			})(data);

		if (!tpldata || !tpldata.join) {
			subtype = tpldata;
			tpldata = [];
		}

		if (LAN && LAN.split) {
			if (self.L != LAN) {
				self.K = '*';
				self.V = 'If';
				self.D = {
					'*': {
						// '中文':
					}
				};
				translateJSON = self.D;

				var dblans = translateJSON.$ || [],
					dblansMap = {},
					lanKeys = LAN.split(',');
				lanIndexArr = self.M = [];
				for(i = dblans.length; i--;) dblansMap[dblans[i]] = i;
				for(i = lanKeys.length; i--;) {
					lanIndex = dblansMap[lanKeys[i]];
					if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
				}
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
		if (!tpldata.length || msg.indexOf('%') == -1) return msg;

		return msg.replace(/%s|%p|%\{.+?\}/g, function() {
			var newVal = tpldata[replace_index++];
			return newVal === undefined ? '' : newVal;
		});
	}
	/* eslint-enable */



	var v1 = I18N('中文');

	{
		"[i18nc] skip_scan"
		var v2 = "跳过这个中文";
	}
}

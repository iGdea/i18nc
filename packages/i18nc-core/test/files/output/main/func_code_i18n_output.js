module.exports = function code()
{
	var word = I18N('中文');
	consol.log(word, I18N('中文2'));
	I18N('中文3', [I18N('中文4'), I18N('中文5')]);

	function I18N(msg, tpldata, subkey)
	{
		if (!msg) return msg === undefined || msg === null ? '' : '' + msg;
	
		var self = I18N,
			data = self.$ || (self.$ = {}),
			translateJSON,
			replace_index = 0,
			options = {},
			lanIndexArr, i, lanIndex, msgResult, translateValues;
	
		if (!tpldata || !tpldata.join) {
			subkey = tpldata;
			tpldata = [];
		}
		if (subkey && typeof subkey == 'object') {
			options = subkey;
			subkey = options.subkey;
		}
	
		var LAN = options.language || (function(cache) {
			if (!cache.global) {
				cache.global = (typeof window == 'object' && window)
					|| (typeof global == 'object' && global)
					|| {};
			}
		
			return cache.global.__i18n_lan__;
		})(data);
	
		if (LAN && LAN.split) {
			if (self.L != LAN) {
				self.K = '*';
				self.V = 'Kf';
				self.D = {
					'*': {
						// '中文':
						// '中文2':
						// '中文3':
						// '中文4':
						// '中文5':
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
			var _getVaule = function(subkey) {
				translateValues = translateJSON[subkey] && translateJSON[subkey][msg];
				if (translateValues) {
					msgResult = translateValues[lanIndex];
					if (typeof msgResult == 'number') msgResult = translateValues[msgResult];
				}
			};
			for(i = lanIndexArr.length; !msgResult && i--;) {
				lanIndex = lanIndexArr[i];
				if (subkey) _getVaule(subkey);
				if (!msgResult) _getVaule('*');
			}
	
			if (msgResult) msg = msgResult;
		}
	
		msg += '';
		if (!tpldata.length || msg.indexOf('%') == -1) return msg;
	
		return msg.replace(/%\{(\d+)\}/g, function(all, index) {
				var newVal = tpldata[+index];
				return newVal === undefined ? '' : newVal;
			})
			.replace(/%s|%p|%\{.+?\}/g, function() {
				var newVal = tpldata[replace_index++];
				return newVal === undefined ? '' : newVal;
			});
	}
}

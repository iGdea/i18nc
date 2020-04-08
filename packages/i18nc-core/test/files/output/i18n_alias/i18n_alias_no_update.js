module.exports = function code()
{


	/* eslint-disable */
	function I18NNew(msg, tpldata, subkey) {
		if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

		var self = I18NNew,
			data = self.$ || (self.$ = {}),
			translateJSON,
			replace_index = 0,
			options = {},
			lanIndexArr,
			i,
			lanIndex,
			translateMsg,
			translateValues;

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
				cache.global =
					(typeof window == 'object' && window) ||
					(typeof global == 'object' && global) ||
					{};
			}
	
			return cache.global.__i18n_lan__;
		})(data);

		if (LAN && LAN.split) {
			if (self.L != LAN) {
				self.K = '*';
				self.V = 'Lf';
				self.D = {
					'*': {
						// '中文':
						// '中文2':
						// '中文4':
					}
				};
				translateJSON = self.D;

				var dblans = translateJSON.$ || [],
					dblansMap = {},
					lanKeys = LAN.split(',');
				lanIndexArr = self.M = [];

				for (i = dblans.length; i--; ) dblansMap[dblans[i]] = i;

				for (i = lanKeys.length; i--; ) {
					lanIndex = dblansMap[lanKeys[i]];
					if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
				}
				self.L = LAN;
			}

			lanIndexArr = self.M;
			translateJSON = self.D;
			var _getVaule = function(subkey) {
				translateValues =
					translateJSON[subkey] && translateJSON[subkey][msg];
				if (translateValues) {
					translateMsg = translateValues[lanIndex];
					if (typeof translateMsg == 'number')
						translateMsg = translateValues[translateMsg];
				}
			};
			for (i = lanIndexArr.length; !translateMsg && i--; ) {
				lanIndex = lanIndexArr[i];
				if (subkey) _getVaule(subkey);
				if (!translateMsg) _getVaule('*');
			}

			if (translateMsg) {
				msg = translateMsg;
			} else if (options.forceMatch) {
				return '';
			}
		}

		msg += '';
		if (!tpldata.length || msg.indexOf('%') == -1) return msg;

		return msg
			.replace(/%\{(\d+)\}/g, function(all, index) {
				var newVal = tpldata[+index];
				return newVal === undefined ? '' : newVal;
			})
			.replace(/%s|%p|%\{.+?\}/g, function() {
				var newVal = tpldata[replace_index++];
				return newVal === undefined ? '' : newVal;
			});
	}
	/* eslint-enable */



	var word = I18NNew('中文');
	consol.log(word, I18NNew('中文2'));
	I18N('中文3', [I18NNew('中文4'), I18N('中文5')]);
	I18N('中文4', 'subkey');
	I18N('中文5', { subkey: 'subkey' });


	function I18N(msg, tpldata, subkey) {
		if (!msg) return msg === undefined || msg === null ? '' : '' + msg;
	
		var self = I18N,
			data = self.$ || (self.$ = {}),
			translateJSON,
			replace_index = 0,
			options = {},
			lanIndexArr,
			i,
			lanIndex,
			translateMsg,
			translateValues;
	
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
				cache.global =
					(typeof window == 'object' && window) ||
					(typeof global == 'object' && global) ||
					{};
			}
		
			return cache.global.__i18n_lan__;
		})(data);
	
		if (LAN && LAN.split) {
			if (self.L != LAN) {
				self.K = '*';
				self.V = 'Lf';
				self.D = {
					'*': {
						// '中文3':
						// '中文5':
					},
					'subkey': {
						// '中文4':
						// '中文5':
					}
				};
				translateJSON = self.D;
	
				var dblans = translateJSON.$ || [],
					dblansMap = {},
					lanKeys = LAN.split(',');
				lanIndexArr = self.M = [];
	
				for (i = dblans.length; i--; ) dblansMap[dblans[i]] = i;
	
				for (i = lanKeys.length; i--; ) {
					lanIndex = dblansMap[lanKeys[i]];
					if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
				}
				self.L = LAN;
			}
	
			lanIndexArr = self.M;
			translateJSON = self.D;
			var _getVaule = function(subkey) {
				translateValues =
					translateJSON[subkey] && translateJSON[subkey][msg];
				if (translateValues) {
					translateMsg = translateValues[lanIndex];
					if (typeof translateMsg == 'number')
						translateMsg = translateValues[translateMsg];
				}
			};
			for (i = lanIndexArr.length; !translateMsg && i--; ) {
				lanIndex = lanIndexArr[i];
				if (subkey) _getVaule(subkey);
				if (!translateMsg) _getVaule('*');
			}
	
			if (translateMsg) {
				msg = translateMsg;
			} else if (options.forceMatch) {
				return '';
			}
		}
	
		msg += '';
		if (!tpldata.length || msg.indexOf('%') == -1) return msg;
	
		return msg
			.replace(/%\{(\d+)\}/g, function(all, index) {
				var newVal = tpldata[+index];
				return newVal === undefined ? '' : newVal;
			})
			.replace(/%s|%p|%\{.+?\}/g, function() {
				var newVal = tpldata[replace_index++];
				return newVal === undefined ? '' : newVal;
			});
	}
}

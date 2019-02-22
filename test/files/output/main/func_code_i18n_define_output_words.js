module.exports = function code()
{


	/* eslint-disable */
	function I18N(msg, tpldata, subtype)
	{
		if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

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
						// 'out define 中文':
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



	var word = I18N('out define 中文');

	define(function()
	{


		/* eslint-disable */
		function I18N(msg, tpldata, subtype)
		{
			if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

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



		word = I18N('中文');
	});

	define('define2', function()
	{


		/* eslint-disable */
		function I18N(msg, tpldata, subtype)
		{
			if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

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
						'$': ['zh'],
						'*': { 'define2 中文': ['define2 中文'] }
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



		word = I18N('define2 中文');
	});

	// define 的中文包含在subscope，本身不包含中文
	define('define3', function()
	{


		/* eslint-disable */
		function I18N(msg, tpldata, subtype)
		{
			if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

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
							// 'define3 中文':
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



		function somehadler()
		{
			word = I18N('define3 中文')
		}
	});

	define('define4', function()
	{


		/* eslint-disable */
		function I18N(msg, tpldata, subtype)
		{
			if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

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
							// 'define4 中文':
							// 'define5 中文':
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



		// define 嵌套
		word = I18N('define4 中文');

		define('define5', function()
		{
			word = I18N('define5 中文');
		});
	});


	// 预先定义了I18N函数
	function somehadler()
	{
		function I18N(msg, tpldata, subtype)
		{
			if (!msg) return msg === undefined || msg === null ? '' : '' + msg;
		
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
							// 'define6 中文':
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

		define('define6', function()
		{
			word = I18N('define6 中文');
		});
	}
}

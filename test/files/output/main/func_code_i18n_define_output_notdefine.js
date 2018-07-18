module.exports = function code()
{


	/* eslint-disable */
	function I18N(msg, tpldata, subtype)
	{
		var self = I18N;
		var data = self.$ || (self.$ = {});
		var LAN = (function(cache)
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
			var lanArr, i, len, lanItem;
			if (self.L != LAN)
			{
				self.K = '*';
				self.V = 'b';
				self.D = {
					'en-US': {
						'DEFAULTS': {
							// 'define2 中文':
							// 'define3 中文':
							// 'define4 中文':
							// 'define5 中文':
							// 'out define 中文':
							// '中文':
							'<e.g.> translate word': null
						}
					}
				};

				var __TRANSLATE_JSON__ = self.D;
				var lanKeys = LAN.split(',');
				lanArr = self.M = [];
				for(i = 0, len = lanKeys.length; i < len; i++)
				{
					lanItem = __TRANSLATE_JSON__[lanKeys[i]];
					if (lanItem) lanArr.push(lanItem);
				}
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
				if (!resultDefault)
				{
					alldefaults = lanItem.DEFAULTS;
					resultDefault = alldefaults && alldefaults[msg];
				}
			}

			if (resultSubject) msg = resultSubject;
			else if (resultDefault) msg = resultDefault;
		}

		msg += '';
		if (!tpldata.length || msg.indexOf('%') == -1) return msg;

		var replace_index = 0;
		return msg.replace(/%s|%\{.+?\}/g, function(all)
		{
			var newVal = tpldata[replace_index++];
			return newVal === undefined || newVal === null ? all : newVal;
		});
	}
	/* eslint-enable */



	var word = I18N('out define 中文');

	define(function()
	{
		word = I18N('中文');
	});

	define('define2', function()
	{
		word = I18N('define2 中文');
	});

	// define 的中文包含在subscope，本身不包含中文
	define('define3', function()
	{
		function somehadler()
		{
			word = I18N('define3 中文')
		}
	});

	define('define4', function()
	{
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
			var self = I18N;
			var data = self.$ || (self.$ = {});
			var LAN = (function(cache)
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
				var lanArr, i, len, lanItem;
				if (self.L != LAN)
				{
					self.K = '*';
					self.V = 'b';
					self.D = {
						'en-US': {
							'DEFAULTS': {
								// 'define6 中文':
								'<e.g.> translate word': null
							}
						}
					};
		
					var __TRANSLATE_JSON__ = self.D;
					var lanKeys = LAN.split(',');
					lanArr = self.M = [];
					for(i = 0, len = lanKeys.length; i < len; i++)
					{
						lanItem = __TRANSLATE_JSON__[lanKeys[i]];
						if (lanItem) lanArr.push(lanItem);
					}
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
					if (!resultDefault)
					{
						alldefaults = lanItem.DEFAULTS;
						resultDefault = alldefaults && alldefaults[msg];
					}
				}
		
				if (resultSubject) msg = resultSubject;
				else if (resultDefault) msg = resultDefault;
			}
		
			msg += '';
			if (!tpldata.length || msg.indexOf('%') == -1) return msg;
		
			var replace_index = 0;
			return msg.replace(/%s|%\{.+?\}/g, function(all)
			{
				var newVal = tpldata[replace_index++];
				return newVal === undefined || newVal === null ? all : newVal;
			});
		}

		define('define6', function()
		{
			word = I18N('define6 中文');
		});
	}
}

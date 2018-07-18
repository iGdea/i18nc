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
	function I18N(msg, tpldata)
	{
		msg += '';
		if (!tpldata || !tpldata.length || msg.indexOf('%') == -1) return msg;
	
		var self = I18N;
	
		self.K = '*';
		self.V = 'b.s';
	
		var replace_index = 0;
		return msg.replace(/%s|%\{.+?\}/g, function(all)
		{
			var newVal = tpldata[replace_index++];
			return newVal === undefined || newVal === null ? all : newVal;
		});
	}

	ctx.I18N = I18N;
});

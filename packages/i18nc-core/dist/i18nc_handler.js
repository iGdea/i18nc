;(function(handler)
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
		if (!msg) return msg === undefined || msg === null ? '' : '' + msg;
	
		msg += '';
		if (!tpldata || !tpldata.length || msg.indexOf('%') == -1) return msg;
	
		var replace_index = 0;
		return msg.replace(/%\{(\d+)\}/g, function(all, index) {
				var newVal = tpldata[+index];
				return newVal === undefined ? '' : newVal;
			})
			.replace(/%s|%p|%\{.+?\}/g, function() {
				var newVal = tpldata[replace_index++];
				return newVal === undefined ? '' : newVal;
			});
	}

	ctx.I18N = I18N;
});

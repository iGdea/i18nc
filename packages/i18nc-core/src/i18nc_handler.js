'use strict';

module.exports = function $handlerName(msg, tpldata)
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

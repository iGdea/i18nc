function $handlerName(msg, tpldata)
{
	$func_header
	var self = $handlerName;
	self.__FILE_KEY__ = "$FILE_KEY";
	self.__FUNCTION_VERSION__ = "$FUNCTION_VERSION";
	if (!tpldata || !tpldata.join) tpldata = [];
	var replace_index = 0;
	return (''+msg).replace(/(%s)|(%\{(.+?)\})/g, function()
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? '' : newVal;
	});
	$func_footer
}

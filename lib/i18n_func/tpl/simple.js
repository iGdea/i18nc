function $handlerName(msg, tpldata)
{
	if (!tpldata || !tpldata.join) return ''+msg;

	var self = $handlerName;
	self.__FILE_KEY__ = "$FILE_KEY";
	self.__FUNCTION_VERSION__ = "$FUNCTION_VERSION";

	var replace_index = 0;
	return (''+msg).replace(/(%s)|(%\{(.+?)\})/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

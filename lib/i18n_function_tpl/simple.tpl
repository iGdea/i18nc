function {{@handlerName}}(msg, tpldata) {
	var __FILE_KEY__ = "{{FILE_KEY}}";
	var __FUNCTION_VERSION__ = "{{@FUNCTION_VERSION}}";
	if (!tpldata.slice) tpldata = [];
	var replace_index = 0;
	return (''+msg).replace(/(%s)|(%\{(.+?)\}%)/g, function() {
		var newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? '' : newVal;
	});
}

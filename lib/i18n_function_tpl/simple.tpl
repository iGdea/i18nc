function {{@handlerName}}(msg) {
	var __FILE_KEY__ = "{{FILE_KEY}}";
	var __FUNCTION_VERSION__ = "{{@FUNCTION_VERSION}}";
	return typeof msg == 'string' ? msg : ''+msg;
}

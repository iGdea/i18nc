function {{@handlerName}}(msg) {
	// @see https://github.com/Bacra/node-i18nc-core/wiki/I18N_handler
	var __FILE_KEY__ = "{{FILE_KEY}}";
	var __FUNCTION_VERSION__ = "{{@FUNCTION_VERSION}}";
	return typeof msg == 'string' ? msg : ''+msg;
}

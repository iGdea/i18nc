/* global $globalHandlerName $TRANSLATE_JSON_CODE */

'use strict';

module.exports = function $handlerName(msg)
{
	var self = $handlerName;
	var data = self.$;

	if (!data)
	{
		data = self.$ = {};
		// K: __FILE_KEY__
		// V: __FUNCTION_VERSION__
		// D: __TRANSLATE_JSON__
		self.K = "$FILE_KEY";
		self.V = "$FUNCTION_VERSION";
		self.D = $TRANSLATE_JSON_CODE;
	}

	return ''+$globalHandlerName(msg, arguments, self.D, self.K, data, self);
}

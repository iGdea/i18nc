var _ = require('underscore');

exports.defaults =
{
	handlerName: 'I18N',
	cutWordReg: /[^<>]*[^\u0020-\u007e]+[^<>]*/g,
}

exports.extend = function(obj)
{
	if (obj)
	{
		return obj.__ || (obj.__ = _.extend({}, obj, exports.defaults));
	}
	else
	{
		return _.extend({}, exports.defaults);
	}
}

'use strict';

module.exports = function(code)
{
	return function(tpldata)
	{
		return code.toString().replace(/\$(\w+)/g, function(all, key)
		{
			return tpldata[key] || all;
		});
	};
};

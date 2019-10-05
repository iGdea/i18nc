'use strict';

var debug = require('debug')('i18nc-key-trim');
var TRIM_REG = /^(\s*)(.*?)(\s*)$/;

exports = module.exports = function(i18nc)
{
	i18nc.registerPlugin('keyTrim', function(i18nc, settings, enabled)
	{
		debug('register keytrim for i18nc');
		i18nc.addListener('cutword', function(emitData)
		{
			if (emitData.options.pluginEnabled.keyTrim)
			{
				debug('run by keytrim');
				emitData.result = keyTrim(emitData.result);
			}
			else
			{
				debug('keytrim is not enabled');
			}
		});

		enabled.keyTrim = false;
	});
};

exports.keyTrim = keyTrim;
function keyTrim(lineStrings)
{
	var result = [];
	lineStrings.forEach(function(item)
	{
		if (!item || !item.translateWord || !item.value)
		{
			result.push(item);
			return;
		}

		var value = item.value;
		var headerEmpty, footerEmpty;
		var valueNew = value.replace(TRIM_REG, function(all, header, other, footer)
			{
				headerEmpty = header;
				footerEmpty = footer;
				return other;
			});

		if (headerEmpty) result.push({translateWord: false, value: headerEmpty, ignore: item.ignore, disconnected: item.disconnected});
		if (valueNew) result.push({translateWord: true, value: valueNew, ignore: item.ignore, disconnected: item.disconnected});
		if (footerEmpty) result.push({translateWord: false, value: footerEmpty, ignore: item.ignore, disconnected: item.disconnected});
	});

	return result;
}

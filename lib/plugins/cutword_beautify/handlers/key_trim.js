'use strict';

var TRIM_REG = /^(\s*)(.*?)(\s*)$/;

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

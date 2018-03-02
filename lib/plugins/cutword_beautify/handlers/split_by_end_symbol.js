var debug = require('debug')('i18nc-core:splitByEndSymbol');

exports.splitByEndSymbol = splitByEndSymbol;
function splitByEndSymbol(lineStrings)
{
	var symbolReg = /[.!?;。！？；]/g;
	var result = [];
	lineStrings.forEach(function(item, index)
	{
		if (!item || !item.translateWord || !item.value)
		{
			result.push(item);
			return;
		}

		var value = item.value;
		var tmpValue = '';
		var splitIndexs = [];
		while(symbolReg.test(value))
		{
			var index = symbolReg.lastIndex;
			splitIndexs.push(index);
		}

		debug('splitIndexs:%o', splitIndexs);
		if (!splitIndexs.length)
		{
			result.push(item);
			return;
		}

		var sliceStartIndex = 0;
		splitIndexs.forEach(function(index)
		{
			var newValue = value.slice(sliceStartIndex, index);
			sliceStartIndex += newValue.length;
			debug('newValue:%s', newValue);

			if (newValue.length > 1)
			{
				result.push({translateWord: true, value: tmpValue, ignore: item.ignore, disconnected: true});
				tmpValue = newValue;
			}
			else
			{
				tmpValue += newValue;
			}
		});

		if (tmpValue) result.push({translateWord: true, value: tmpValue, ignore: item.ignore, disconnected: true});
		// @todo 最后部分，不一定是需要翻译的
		if (value.length != sliceStartIndex)
		{
			result.push(
				{
					translateWord: true,
					value: value.slice(sliceStartIndex),
					ignore: item.ignore,
					disconnected: true
				});
		}
	});

	return result;
}

'use strict';

var debug = require('debug')('i18nc-key-end');

exports = module.exports = function(i18nc)
{
	i18nc.registerPlugin('keyEnd', function(i18nc, settings, enabled)
	{
		debug('register keyend for i18nc');
		i18nc.addListener('cutword', function(emitData)
		{
			if (emitData.options.pluginEnabled.keyEnd)
			{
				debug('run by keyend');
				emitData.result = keyEnd(emitData.result, emitData.options);
			}
			else
			{
				debug('keyend is not enabled');
			}
		});

		// 移除“.”，防止域名/序号等字符被截断
		settings.endSymbols = '!?;。！？；';
		enabled.keyEnd = false;
	});
};

exports.keyEnd = keyEnd;
function keyEnd(lineStrings, options)
{
	var endSymbols    = options.pluginSettings.endSymbols;
	var cutwordReg    = options.cutwordReg;
	var hasCutWordReg = cutwordReg instanceof RegExp;
	var symbolReg     = new RegExp('['+endSymbols+']', 'g');
	var result        = [];

	lineStrings.forEach(function(item)
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
		if (value.length != sliceStartIndex)
		{
			var newVal = value.slice(sliceStartIndex);
			var translateWord = false;
			if (hasCutWordReg)
			{
				cutwordReg.lastIndex = 0;
				translateWord = cutwordReg.test(newVal);
				cutwordReg.lastIndex = 0;
			}

			result.push(
			{
				translateWord: translateWord,
				value: newVal,
				ignore: item.ignore,
				disconnected: true
			});
		}
	});

	return result;
}

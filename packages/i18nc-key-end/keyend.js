'use strict';

const debug = require('debug')('i18nc-key-end');

exports = module.exports = function(i18nc) {
	i18nc.registerPlugin('keyEnd', function(i18nc, settings, enabled) {
		debug('register keyend for i18nc');
		i18nc.addListener('cutword', function(emitData) {
			if (emitData.options.pluginEnabled.keyEnd) {
				debug('run by keyend');
				emitData.result = keyEnd(emitData.result, emitData.options);
			} else {
				debug('keyend is not enabled');
			}
		});

		// 移除“.”，防止域名/序号等字符被截断
		settings.endSymbols = '!?;。！？；';
		enabled.keyEnd = false;
	});
};

exports.keyEnd = keyEnd;
function keyEnd(lineStrings, options) {
	const endSymbols = options.pluginSettings.endSymbols;
	const cutwordReg = options.cutwordReg;
	const hasCutWordReg = cutwordReg instanceof RegExp;
	const symbolReg = new RegExp('[' + endSymbols + ']', 'g');
	const result = [];

	lineStrings.forEach(function(item) {
		if (!item || !item.translateWord || !item.value) {
			result.push(item);
			return;
		}

		const value = item.value;
		let tmpValue = '';
		const splitIndexs = [];
		while (symbolReg.test(value)) {
			const index = symbolReg.lastIndex;
			splitIndexs.push(index);
		}

		debug('splitIndexs:%o', splitIndexs);
		if (!splitIndexs.length) {
			result.push(item);
			return;
		}

		let sliceStartIndex = 0;
		splitIndexs.forEach(function(index) {
			const newValue = value.slice(sliceStartIndex, index);
			sliceStartIndex += newValue.length;
			debug('newValue:%s', newValue);

			if (newValue.length > 1) {
				result.push({
					translateWord: true,
					value: tmpValue,
					ignore: item.ignore,
					disconnected: true
				});
				tmpValue = newValue;
			} else {
				tmpValue += newValue;
			}
		});

		if (tmpValue)
			result.push({
				translateWord: true,
				value: tmpValue,
				ignore: item.ignore,
				disconnected: true
			});
		if (value.length != sliceStartIndex) {
			const newVal = value.slice(sliceStartIndex);
			let translateWord = false;
			if (hasCutWordReg) {
				cutwordReg.lastIndex = 0;
				translateWord = cutwordReg.test(newVal);
				cutwordReg.lastIndex = 0;
			}

			result.push({
				translateWord: translateWord,
				value: newVal,
				ignore: item.ignore,
				disconnected: true
			});
		}
	});

	return result;
}

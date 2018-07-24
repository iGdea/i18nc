'use strict';

var _ = require('lodash');
var optionsUtils = require('../../../lib/utils/options_utils');
var valsUtils = require('../../../lib/utils/options_vals');

var maxOldKeyLen = 0;
var tableContentArr = _.map(optionsUtils.LINK_VALUES, function(newKeys, oldKey)
	{
		if (oldKey.length > maxOldKeyLen) maxOldKeyLen = oldKey.length;
		return {old: oldKey, new: Array.isArray(newKeys) ? newKeys : [newKeys]};
	})
	.sort(function(a, b)
	{
		return a.old.toLowerCase() > b.old.toLowerCase() ? 1 : -1;
	});
var oldKeyStr = new Array(maxOldKeyLen+1).join(' ');
tableContentArr = tableContentArr.map(function(item)
{
	var oldKeyInfo = valsUtils.str2keyVal(item.old);
	var newKeysStrArr = item.new.map(function(val)
		{
			var newKeyInfo = valsUtils.str2keyVal(val);
			return '`'+newKeyInfo.key+'` = `'+newKeyInfo.value+'`';
		});
	return '| '+oldKeyStr.substr(item.old.length)
		+'`'+oldKeyInfo.key+'` = `'+oldKeyInfo.value+'`'
		+' | '+newKeysStrArr.join('<br/>')
		+' |';
});
var tableContent = '| '+oldKeyStr.substr(1)+'当此配置为'+' | 将强制设置成 |\n'
	+'|'+new Array(maxOldKeyLen+3).join('-')+'|----------|\n'
	+tableContentArr.join('\n');


module.exports = tableContent;

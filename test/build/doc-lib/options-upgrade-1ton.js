'use strict';

var _ = require('lodash');
var depdOptions = require('../../../lib/upgrade/depd_options');
var valsUtils = require('../../../lib/utils/options_vals');

var maxOldKeyLen = 0;
var tableContentArr = _.map(depdOptions.OPTIONS_OLDKEY_MAP, function(newKeys, oldKey)
	{
		if (oldKey.length > maxOldKeyLen) maxOldKeyLen = oldKey.length;
		return {old: oldKey, new: newKeys};
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
var tableContent = '| '+oldKeyStr.substr(1)+'老配置'+' | 新配置 |\n'
	+'|'+new Array(maxOldKeyLen+3).join('-')+'|----------|\n'
	+tableContentArr.join('\n');


module.exports = tableContent;

'use strict';

var _ = require('lodash');
var valsUtils = require('../../../lib/utils/options_vals');


exports.table_1toN = function(mapData, oldTableName, newTableName)
{
	var maxOldKeyLen = 0;
	var tableContentArr = _.map(mapData, function(newKeys, oldKey)
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
		return '| `'+oldKeyInfo.key+'` = `'+oldKeyInfo.value+'`'+oldKeyStr.substr(item.old.length)
			+' | '+newKeysStrArr.join('<br/>')
			+' |';
	});

	return '| '+oldTableName+oldKeyStr.substr(oldTableName.length*2-8)+' | '+newTableName+' |\n'
		+'|'+new Array(maxOldKeyLen+9).join('-')+'|----------|\n'
		+tableContentArr.join('\n');

}

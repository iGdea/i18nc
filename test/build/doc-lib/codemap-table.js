'use strict';

var _ = require('lodash');
var valsUtils = require('../../../lib/utils/options_vals');
var ArrayPush = Array.prototype.push;


exports.table_1toN = function(mapData, oldTableName, newTableName)
{
	// var maxOldKeyLen = 0;
	// var maxOldValLen = 0;
	var oldKeyMap = {};
	_.each(mapData, function(newKeys, oldKey)
	{
		var oldKeyInfo = valsUtils.str2keyVal(oldKey);
		var oldKeyVal = ''+oldKeyInfo.value;
		var oldKeyKey = oldKeyInfo.key;
		// maxOldKeyLen = Math.max(oldKeyKey.length, maxOldKeyLen);
		// maxOldValLen = Math.max(oldKeyVal.length, maxOldValLen);

		var arr = oldKeyMap[oldKeyKey] || (oldKeyMap[oldKeyKey] = []);
		arr.push(
		{
			old_value: oldKeyVal,
			news: Array.isArray(newKeys) ? newKeys : [newKeys]
		});
	});


	// var oldKeyStr = new Array(maxOldKeyLen+1).join(' ');
	// var oldValStr = new Array(maxOldValLen+1).join(' ');
	var tableContentArr = [];

	_.map(oldKeyMap, function(olds, old_key)
		{
			return {
				old_key: old_key,
				olds: olds,
			};
		})
		.sort(function(a, b)
		{
			return a.old_key.toLowerCase() > b.old_key.toLowerCase() ? 1 : -1;
		})
		.forEach(function(item)
		{
			var firstOldItem = item.olds[0];
			if (item.olds.length > 1)
			{
				var arr = item.olds.map(function(oldItem, index)
					{
						if (!index) return;

						return '<tr>'
							+'<td><code>'+oldItem.old_value+'</code></td>'
							+'<td>'+newItemsRender(oldItem.news)+'</td>'
							+'</tr>';
					});

				arr[0] = '<tr>'
					+'<td rowspan="'+item.olds.length+'"><code>'+item.old_key+'</code></td>'
					+'<td><code>'+firstOldItem.old_value+'</code></td>'
					+'<td>'+newItemsRender(firstOldItem.news)+'</td>'
					+'</tr>';

				ArrayPush.apply(tableContentArr, arr);
			}
			else
			{
				var str = '<tr>'
					+'<td><code>'+item.old_key+'</code></td>'
					+'<td><code>'+firstOldItem.old_value+'</code></td>'
					+'<td>'+newItemsRender(firstOldItem.news)+'</td>'
					+'</tr>';

				tableContentArr.push(str);
			}
		});

	return [
		'<table>',
			'\t<tr>',
				'\t\t<th colspan="2">'+oldTableName+'</th>',
				'\t\t<th>'+newTableName+'</th>',
			'\t</tr>',
			'\t'+tableContentArr.join('\n\t'),
		'</table>'
	].join('\n');

}


function newItemsRender(arr)
{
	return arr.map(function(val)
		{
			var newKeyInfo = valsUtils.str2keyVal(val);
			return '<code>'+newKeyInfo.key+'</code> = <code>'+newKeyInfo.value+'</code>';
		})
		.join('<br/>');
}

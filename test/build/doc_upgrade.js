'use strict';

var _ = require('lodash');
var fs = require('fs');
var tpl = fs.readFileSync(__dirname+'/doc_lib/tpl/upgrade.tpl.md').toString();
var codeMapTable = require('./doc_lib/codemap_table');
var depdOptions = require('../../lib/upgrade/depd_options');

var content = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'OPTIONS_RENAME_TABLE_DATA':
			var tableData = _.map(depdOptions.OPTIONS_RENAME_MAP, function(newKey, oldKey)
				{
					return [oldKey, newKey];
				})
				.sort(function(a, b)
				{
					return a[0] > b[0] ? 1 : -1;
				});

			var info = codeMapTable.table_md(tableData,
				[
					{name: '老版本', align: 'right'},
					{name: '新版本', align: 'left'}
				]);

			return info.content;

		case 'OPTIONS_SWITCH_TABLE_DATA':
			return codeMapTable.table_1toN(depdOptions.OPTIONS_OLDKEY_MAP, '老配置', '新配置');

		default:
			return all;
	}
});

fs.writeFileSync(__dirname+'/../../docs/zh-CN/upgrade.md', content);

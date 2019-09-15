'use strict';

var _ = require('lodash');
var fs = require('fs');
var tpl = fs.readFileSync(__dirname+'/upgrade.tpl.md').toString();
var codeMapTable = require('../lib/codemap_table');
var VARS = require('i18nc-options').VARS;

var content = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'OPTIONS_RENAME_TABLE_DATA':
			var tableData = _.map(VARS.OLD_RENAME_OPTIONS, function(newKey, oldKey)
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
			return codeMapTable.table_1toN(VARS.OLD_VALUE_OPTIONS, '老配置', '新配置');

		default:
			return all;
	}
});

fs.writeFileSync(__dirname+'/../../../../docs/zh_CN/upgrade.md', content);

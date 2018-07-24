'use strict';

var fs = require('fs');
var tpl = fs.readFileSync(__dirname+'/doc-lib/tpl/upgrade.tpl').toString();
var upgrade1to1Data = require('./doc-lib/options-upgrade-1to1');
var codeMapTable = require('./doc-lib/codemap-table');
var depdOptions = require('../../lib/upgrade/depd_options');

var content = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'OPTIONS_RENAME_TABLE_DATA':
			return upgrade1to1Data;

		case 'OPTIONS_SWITCH_TABLE_DATA':
			return codeMapTable.table_1toN(depdOptions.OPTIONS_OLDKEY_MAP, '老配置', '新配置');

		default:
			return all;
	}
});

fs.writeFileSync(__dirname+'/../../doc/zh-CN/upgrade.md', content);

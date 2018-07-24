'use strict';

var fs = require('fs');
var tpl = fs.readFileSync(__dirname+'/doc-lib/tpl/upgrade.tpl').toString();
var upgrade1to1Data = require('./doc-lib/options-upgrade-1to1');

var content = tpl.replace(/\$(\w+)/, function(all, key)
{
	switch(key)
	{
		case 'OPTIONS_RENAME_TABLE_DATA':
			return upgrade1to1Data;

		default:
			return all;
	}
});

fs.writeFileSync(__dirname+'/../../doc/zh-CN/upgrade.md', content);

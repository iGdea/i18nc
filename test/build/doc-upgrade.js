'use strict';

var _ = require('lodash');
var fs = require('fs');
var tpl = fs.readFileSync(__dirname+'/doc-tpl/upgrade.tpl').toString();
var depdOptions = require('../../lib/upgrade/depd_options');

var maxNewKeyLen = 0;
var maxOldKeyLen = 0;
var tableContentArr = _.map(depdOptions.OPTIONS_OLDKEY_MAP, function(newKey, oldKey)
{
	if (newKey.length > maxNewKeyLen) maxNewKeyLen = newKey.length;
	if (oldKey.length > maxOldKeyLen) maxOldKeyLen = oldKey.length;
	return [oldKey, newKey];
});
var newKeyStr = new Array(maxNewKeyLen+1).join(' ');
var oldKeyStr = new Array(maxOldKeyLen+1).join(' ');
tableContentArr = tableContentArr.map(function(item)
{
	return '| '+oldKeyStr.substr(item[0].length)+item[0]
		+' | '+item[1]+newKeyStr.substr(item[1].length)
		+' |';
});
var tableContent = '| 老版本'+oldKeyStr.substr(5)
	+' | 新版本'+newKeyStr.substr(5)
	+' |\n'
	+'|'+new Array(maxOldKeyLen+2).join('-')+':'
	+'|'+new Array(maxNewKeyLen+3).join('-')
	+'|\n'
	+tableContentArr.join('\n');

var content = tpl.replace(/\$OPTIONS_UPGRADE/, tableContent);

fs.writeFileSync(__dirname+'/../../doc/zh-CN/upgrade.md', content);

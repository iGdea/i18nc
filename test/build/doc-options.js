'use strict';

var fs = require('fs');
var optionsComment = require('./doc-lib/options-comment');
var optionsLinkData = require('./doc-lib/options-link');

var tpl = fs.readFileSync(__dirname+'/doc-lib/tpl/options.tpl').toString();
var content = fs.readFileSync(__dirname+'/../../lib/options.js').toString();

var fileContent = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'OPTIONS_TABLE_DATA':
			return optionsComment(content);

		case 'OPTIONS_LINK_TABLE_DATA':
			return optionsLinkData;

		default:
			return all;
	}
});
fs.writeFileSync(__dirname+'/../../doc/zh-CN/options.md', fileContent);

'use strict';

var fs = require('fs');
var optionsComment = require('./doc-lib/options-comment');

var tpl = fs.readFileSync(__dirname+'/doc-lib/tpl/only-options.tpl.md').toString();
var content = fs.readFileSync(__dirname+'/../../lib/options.js').toString();

var fileContent = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'OPTIONS_TABLE_DATA':
			return optionsComment(content);

		default:
			return all;
	}
});

fs.writeFileSync(__dirname+'/../../docs/zh-CN/only-options.md', fileContent);

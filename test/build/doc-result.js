'use strict';

var _ = require('lodash');
var fs = require('fs');
var resultComment = require('./doc-lib/result-comment');

var tpl = fs.readFileSync(__dirname+'/doc-lib/tpl/result.tpl.md').toString();
var content = fs.readFileSync(__dirname+'/../../lib/result_object.js').toString();
var funcs = resultComment(content);

var fileContent = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'ALL_DATA':
			return _.map(funcs, function(item)
			{
				return item.render();
			})
			.join('\n\n');

		default:
			return all;
	}
});
fs.writeFileSync(__dirname+'/../../docs/zh-CN/result.md', fileContent);

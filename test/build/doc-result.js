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
			var content =
				[
					'CodeInfoResult',
					'FileKeyTranslateWords',
					'CodeTranslateWords',
					'TranslateWords',
					'DirtyWords'
				]
				.map(function(name)
				{
					var item = funcs[name];
					delete funcs[name];
					return item.render();
				});
			_.each(funcs, function(item)
			{
				content.push(item.render());
				return item;
			});
			return content.join('\n\n');

		default:
			return all;
	}
});
fs.writeFileSync(__dirname+'/../../docs/zh-CN/result.md', fileContent);

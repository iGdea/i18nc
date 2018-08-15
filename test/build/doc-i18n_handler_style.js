'use strict';

var fs = require('fs');
var tpl = fs.readFileSync(__dirname+'/doc-lib/tpl/i18n_handler_style.tpl.md').toString();

var fileContent = tpl.replace(/\$(\w+)/g, function(all, key)
{
	switch(key)
	{
		case 'FULL_HANDLER_CODE':
			return require('../files/casefile/i18n_handler/i18n_handler_example').toString();

		case 'SIMPLE_HANDLER_CODE':
			return require('../files/casefile/i18n_handler/i18n_handler_simple_example').toString();

		case 'GLOBAL_HANDLER_CODE':
			return require('../files/casefile/i18n_handler/i18n_handler_global_example').toString();

		default:
			return all;
	}
});
fs.writeFileSync(__dirname+'/../../docs/zh-CN/i18n_handler_style.md', fileContent);

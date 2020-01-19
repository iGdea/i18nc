'use strict';

const fs = require('fs');
const optionsComment = require('../lib/options_comment');

const tpl = fs.readFileSync(__dirname + '/options_full.tpl.md').toString();
const content = fs
	.readFileSync(require.resolve('i18nc-options/lib/defaults'))
	.toString();

const fileContent = tpl.replace(/\$(\w+)/g, function(all, key) {
	switch (key) {
		case 'OPTIONS_TABLE_DATA':
			return optionsComment(content);

		default:
			return all;
	}
});

fs.writeFileSync(
	__dirname + '/../../../../docs/zh_CN/options_full.md',
	fileContent
);

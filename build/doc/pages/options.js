'use strict';

const fs = require('fs');
const optionsComment = require('../lib/options_comment');
const codeMapTable = require('../lib/codemap_table');
const VARS = require('i18nc-options').VARS;

const tpl = fs.readFileSync(__dirname + '/options.tpl.md').toString();
const content = fs
	.readFileSync(require.resolve('i18nc-options/lib/defaults'))
	.toString();

const fileContent = tpl.replace(/\$(\w+)/g, function(all, key) {
	switch (key) {
		case 'OPTIONS_TABLE_DATA':
			return optionsComment(content);

		case 'OPTIONS_LINK_TABLE_DATA':
			return codeMapTable.table_1toN(
				VARS.LINK_VALUES,
				'当此配置为',
				'将强制设置成'
			);

		default:
			return all;
	}
});

fs.writeFileSync(__dirname + '/../../../../docs/zh_CN/options.md', fileContent);

'use strict';

const fs = require('fs');
const tpl = fs.readFileSync(__dirname + '/i18n_handler_style.tpl.md').toString();
const codeMapTable = require('../lib/codemap_table');

const fileContent = tpl.replace(/\$(\w+)/g, function(all, key) {
	switch (key) {
		case 'FULL_HANDLER_CODE':
			return require('../../../files/casefile/i18n_handler/i18n_handler_example').toString();

		case 'SIMPLE_HANDLER_CODE':
			return require('../../../files/casefile/i18n_handler/i18n_handler_simple_example').toString();

		case 'GLOBAL_HANDLER_CODE':
			return require('../../../files/casefile/i18n_handler/i18n_handler_global_example').toString();

		case 'FULL_HANDLER_PARGMS': {
			const tableData = [
				['self.$', '缓存数据'],
				['self.L', '翻译语言列表'],
				['self.K', '函数FileKey'],
				['self.V', '函数版本号'],
				['self.D', '翻译数据'],
				['self.M', '当前语言列表下的翻译数据']
			].map(function(item) {
				item[0] = '`' + item[0] + '`';
				return item;
			});

			return codeMapTable.table_md(tableData, [
				{ name: '成员变量' },
				{ name: '说明' }
			]).content;
		}

		default:
			return all;
	}
});

fs.writeFileSync(
	__dirname + '/../../../../docs/zh_CN/i18n_handler_style.md',
	fileContent
);

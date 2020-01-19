'use strict';

const _ = require('lodash');
const fs = require('fs');
const resultComment = require('../lib/result_comment');

const tpl = fs.readFileSync(__dirname + '/result.tpl.md').toString();
const content = fs
	.readFileSync(__dirname + '/../../../../lib/result_object.js')
	.toString();
const funcs = resultComment(content);

const fileContent = tpl.replace(/\$(\w+)/g, function(all, key) {
	switch (key) {
		case 'ALL_DATA': {
			const content = [
				'CodeInfoResult',
				'FileKeyTranslateWords',
				'CodeTranslateWords',
				'TranslateWords',
				'DirtyWords'
			].map(function(name) {
				const item = funcs[name];
				delete funcs[name];
				return item.render();
			});

			_.each(funcs, function(item) {
				content.push(item.render());
				return item;
			});

			return content.join('\n\n');
		}

		default:
			return all;
	}
});
fs.writeFileSync(__dirname + '/../../../../docs/zh_CN/result.md', fileContent);

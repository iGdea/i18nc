'use strict';

const esprima = require('esprima');
const esshorten = require('esshorten4node11');
const escodegen = require('escodegen');
const debug = require('debug')('i18nc-core:i18nc_func_render');

function tpl2render(code) {
	// 删掉注释
	const originalCode = code.replace(/(\n\r?[\t ]*)?\/\/[^\n]+/g, '');
	// .replace(/(\$func_header);?/, '$1\n\t')
	// .replace(/(\$func_footer);?/, '\n\t$1');

	// 对源码进行压缩
	const minCode = exports
		.min(originalCode)
		.replace(/(\$TRANSLATE_JSON_CODE[;,]?)/, '$1\n\t')
		// 函数体换行
		.replace(/\{/, '{\n\t')
		.replace(/\}([^}]*)$/, '\n}$1');

	const minJsonCodeIndent = '\t';
	let originalJsonCodeIndent = originalCode.match(
		/(\t+)([^\t]*?)\$TRANSLATE_JSON_CODE/
	);
	originalJsonCodeIndent = originalJsonCodeIndent
		? originalJsonCodeIndent[1]
		: '';
	let originalGetLanguageCodeIndent = originalCode.match(
		/(\t+)([^\t]*?)\$getLanguageCode/
	);
	originalGetLanguageCodeIndent = originalGetLanguageCodeIndent
		? originalGetLanguageCodeIndent[1]
		: '';
	debug(
		'originalJsonCodeIndent:%d originalGetLanguageCodeIndent:%d',
		originalJsonCodeIndent.length,
		originalGetLanguageCodeIndent.length
	);

	return function(data, isMin) {
		const code = isMin ? minCode : originalCode;
		const codeIndent = isMin ? minJsonCodeIndent : originalJsonCodeIndent;

		return code.replace(/\$(\w+)/g, function(all, key) {
			let val = data[key];
			if (!val) return '';

			if (key == 'TRANSLATE_JSON_CODE') {
				val = val.split(/\n\r?/).join('\n' + codeIndent);
			} else if (!isMin && key == 'getLanguageCode') {
				val = val
					.split(/\n\r?/)
					.join('\n' + originalGetLanguageCodeIndent);
			}

			return val;
		});
	};
}

exports.min = function(code) {
	const ast = esprima.parse(code);
	const result = esshorten.mangle(ast);

	return escodegen.generate(result, {
		format: {
			renumber: true,
			hexadecimal: true,
			escapeless: true,
			compact: true,
			semicolons: false,
			parentheses: false
		}
	});
};

exports.render = tpl2render(require('./tpl/full.js').toString());
exports.renderSimple = tpl2render(require('./tpl/simple.js').toString());
exports.renderGlobal = tpl2render(require('./tpl/global.js').toString());

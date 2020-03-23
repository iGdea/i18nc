'use strict';

exports.escodegenOptions = {
	comment: true,
	// format: {
	// 	// escapeless 为true的时候，会把 \u0000 这样的字符直接以字符的形式输出
	// 	// 不开启，又会导致一些普通字符转移输出，比如“，”
	// 	escapeless: true,
	// 	newline: '\n',
	// 	indent: {
	// 		style: '\t'
	// 	}
	// }
};

exports.escodegenMinOptions = {
	comment: false,
	// format: {
	// 	// escapeless 为true的时候，会把 \u0000 这样的字符直接以字符的形式输出
	// 	// 不开启，又会导致一些普通字符转移输出，比如“，”
	// 	escapeless: true,
	// 	newline: '\n',
	// 	quotes: 'auto',
	// 	compact: true,
	// 	indent: {
	// 		style: ''
	// 	}
	// }
};

exports.esparseOptions = {
	sourceType: 'module',
	ranges: true,

	plugins: [
		'jsx',
		'typescript'
	]
};

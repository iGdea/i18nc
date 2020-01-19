'use strict';

exports = module.exports = toRender;
const wrapCode = require('./wrap_code.tpl.js').toString();

function toRender(code) {
	return function(tpldata) {
		return code.toString().replace(/\$(\w+)/g, function(all, key) {
			return tpldata[key] || all;
		});
	};
}

exports.wrapCode = function(tplData) {
	return [
		';(' + wrapCode + ')',
		'(function(r, ctx)',
		'{',
		'\t' + tplData.code.replace(/\n\r?/g, '\n\t'),
		'',
		'\tctx.' + tplData.handlerName + ' = ' + tplData.handlerName + ';',
		'});',
		''
	].join('\n');
};

'use strict';

var fs = require('fs');
var toRender = require('./to_render');
var codeAllTpl = toRender(require('../../src/topi18n_all'));
var codeV1Tpl = toRender(require('../../src/topi18n_v1'));
var codeV2Tpl = toRender(require('../../src/topi18n_v2'));
var wrapCodeTpl = require('./wrap_code.tpl.js').toString();


function wrapCode(code)
{
	return [
		';('+wrapCodeTpl+')',
		'(function(r, ctx)',
		'{',
			'\t'+code.replace(/\n\r?/g, '\n\t'),
			'',
			'\tctx.topI18N = topI18N;',
		'});',
		''
	]
	.join('\n');
}

var codeV1 = wrapCode(codeV1Tpl({handlerName: 'topI18N'}));
var codeV2 = wrapCode(codeV2Tpl({handlerName: 'topI18N'}));
var codeAll = wrapCode(
	[
		codeAllTpl(),
		codeV1Tpl({handlerName: 'topI18N_v1'}),
		codeV2Tpl({handlerName: 'topI18N_v2'})
	].join('\n\n\n'));
fs.writeFileSync(__dirname+'/../../dist/topi18n.js', codeV2);
fs.writeFileSync(__dirname+'/../../dist/topi18n_v1.js', codeV1);
fs.writeFileSync(__dirname+'/../../dist/topi18n_all.js', codeAll);

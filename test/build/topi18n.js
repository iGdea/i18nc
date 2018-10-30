'use strict';

var fs = require('fs');
var toRender = require('./to_render');
var codeAllTpl = toRender(require('../../src/topi18n_all'));
var codeV1Tpl = toRender(require('../../src/topi18n_v1'));
var codeV2Tpl = toRender(require('../../src/topi18n_v2'));


var codeV1 = toRender.wrapCode({code: codeV1Tpl({handlerName: 'topI18N'}), handlerName: 'topI18N'});
var codeV2 = toRender.wrapCode({code: codeV2Tpl({handlerName: 'topI18N'}), handlerName: 'topI18N'});
var codeAll = toRender.wrapCode(
{
	code:
		[
			codeAllTpl(),
			codeV1Tpl({handlerName: 'topI18N_v1'}),
			codeV2Tpl({handlerName: 'topI18N_v2'})
		].join('\n\n\n'),
	handlerName: 'topI18N',
});
fs.writeFileSync(__dirname+'/../../dist/topi18n.js', codeV2);
fs.writeFileSync(__dirname+'/../../dist/topi18n_v1.js', codeV1);
fs.writeFileSync(__dirname+'/../../dist/topi18n_all.js', codeAll);

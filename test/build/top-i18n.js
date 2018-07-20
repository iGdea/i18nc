'use strict';

var fs = require('fs');
var code = require('../../src/top_i18n').toString();
var wrapCode = require('./wrap-code.tpl.js').toString();

var content =
[
	';('+wrapCode+')',
	'(function(r, ctx)',
	'{',
		'\t'+code.replace(/\n\r?/g, '\n\t'),
		'',
		'\tctx.topI18N = topI18N;',
	'});',
	''
]
.join('\n');

fs.writeFileSync(__dirname+'/../../dist/top-i18nc.js', content);

'use strict';

var browserify = require('browserify');
var fs = require('fs');
var b = browserify();
b.add(__dirname+'/../../index.js');
b.bundle().pipe(fs.createWriteStream(__dirname+'/../../dist/i18nc-core.js'));

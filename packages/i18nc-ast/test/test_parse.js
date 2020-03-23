const astUtils = require('../lib/ast_util');
const fs = require('fs');


console.log(astUtils.parse(fs.readFileSync(__dirname + '/files/literal.js', 'utf8')));

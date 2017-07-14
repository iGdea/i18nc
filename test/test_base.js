var i18nc = require('../');
var code = require('./example1').toString();


console.log(code);
console.log(' ================ ');

var info = i18nc(code);
console.log(info.code);

console.log(' ================ ');
console.log(info.specialWords, info.dirtyWords);

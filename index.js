exports = module.exports = require('./lib/main');
exports.parse = require('./lib/ast_utils').parse;
exports.version = require('./package.json').version;

require('./lib/emitter').proxy(exports);

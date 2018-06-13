'use strict';

exports = module.exports = require('./lib/main');
exports.defaults = require('./lib/options').defaults;
exports.version = require('./package.json').version;

// 已经采用标准版的json格式去处理翻译数据
// 所以不用再输出parse的接口
// exports.parse = require('./lib/ast_utils').parse;

require('./lib/emitter').proxy(exports);

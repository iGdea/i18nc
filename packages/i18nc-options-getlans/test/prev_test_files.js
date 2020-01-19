'use strict';

const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const optTpl = require('../');
const renders = (exports.renders = {});
const INPUT_PATH = __dirname + '/input/';

[
	'webNavigatorAndProcessDomain',
	'webCookeAndProcssDomian',
	'onlyWebCookie',
	'onlyWebNavigator'
].forEach(function(name) {
	const code = optTpl[name].toString();

	renders[name] = function(vars) {
		return code.replace(/\$LanguageVars\.([\w$]+)\$/g, function(all, name) {
			return vars[name];
		});
	};
});

function main() {
	const p = INPUT_PATH;
	mkdirp.sync(p);

	_.each(renders, function(render, filename) {
		let code = render({
			name: '__i18n_lan__',
			cookie: 'test_lan'
		});

		code = '\'use strict\';\n\n' + 'module.exports = ' + code;

		fs.writeFileSync(p + filename + '.js', code);
	});
}

module.exports = main;

if (process.mainModule === module) main();

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');

exports.requireAfterWrite = function requireAfterWrite(path) {
	const outpath = __dirname + '/files/' + path + '/';
	mkdirp.sync(outpath);

	return function(filename, data, options) {
		const file = outpath + filename;
		if (!process.env.TEST_BUILD) return _requireOrFs(file, options);

		if (typeof data == 'object') {
			data = JSON.stringify(data, null, '\t');
		}

		fs.writeFileSync(file, data);

		return _requireOrFs(file, options);
	};
};

function _requireOrFs(file, options) {
	options || (options = {});

	switch (options.mode) {
		case 'string':
			return fs.readFileSync(file, { encoding: 'utf8' });

		default:
			return require(file);
	}
}

exports.code2arr = function code2arr(code) {
	return code.split('\n').filter(function(val) {
		return val.trim();
	});
};

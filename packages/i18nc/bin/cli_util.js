'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc:cli_util');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const glob = Promise.promisify(require('glob'));
const mkdirp = Promise.promisify(require('mkdirp'));
const path = require('path');
const i18nc = require('i18nc-core');
const stripBOM = require('strip-bom');

exports.scanFileList = scanFileList;
function scanFileList(input, recurse) {
	return fs.statAsync(input).then(
		function(stats) {
			if (stats.isFile()) {
				debug('input is file');
				return fs.realpathAsync(input).then(function(file) {
					return {
						type: 'one',
						data: file
					};
				});
			} else if (stats.isDirectory()) {
				debug('input is dir');
				if (!recurse) throw new Error('Input Is A Directory');

				return glob('**/*', {
					cwd: input,
					nodir: true,
					realpath: true
				}).then(function(files) {
					return {
						type: 'list',
						data: files
					};
				});
			} else {
				throw new Error('Input Is Not File Or Directory');
			}
		},
		function(err) {
			if (!err || !err.code == 'ENOENT') throw err;
			if (!recurse && input.indexOf('*') == -1) throw err;

			debug('input is not exists, start glob');

			return glob(input, { nodir: true, realpath: true }).then(function(
				files
			) {
				return {
					type: 'list',
					data: files
				};
			});
		}
	);
}

/**
 * 写入一个文件，需要判断input本身的文件状态
 */
exports.getWriteOneFilePath = getWriteOneFilePath;
function getWriteOneFilePath(output, input) {
	return fs.statAsync(output).then(
		function(stats) {
			if (stats.isFile()) {
				debug('output is file');
				return output;
			} else if (stats.isDirectory()) {
				debug('output is dir');
				const filename = path.basename(input);
				return output + '/' + filename;
			} else {
				throw new Error('Input Is Not File Or Directory');
			}
		},
		function(err) {
			if (!err || err.code != 'ENOENT') throw err;

			debug('output is not exists');
			// 当文件不存在的时候
			const tailStr = output[output.length - 1];
			let dir, rfile;
			if (tailStr == '/' || tailStr == '\\') {
				debug('ouput maybe is path');
				dir = output;
				rfile = dir + path.basename(input);
			} else {
				dir = path.resolve(output, '..');
				rfile = output;
			}

			return mkdirp(dir).then(function() {
				return rfile;
			});
		}
	);
}

exports.key2key = key2key;
function key2key(obj, keyMap) {
	const result = {};
	_.each(obj, function(val, key) {
		return (result[keyMap[key] || key] = val);
	});
	return result;
}

exports.file2i18nc = file2i18nc;
function file2i18nc(file, options) {
	return fs
		.readFileAsync(file, {
			encoding: 'utf8'
		})
		.then(function(code) {
			code = stripBOM(code);
			return i18nc(code, options);
		});
}

exports.argsToArray = argsToArray;
function argsToArray(val) {
	return val
		.split(',')
		.map(function(val) {
			return val.trim();
		})
		.filter(function(val) {
			return val;
		});
}

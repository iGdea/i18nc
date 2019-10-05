'use strict';

// var _	= require('lodash');
var fs		= require('fs');
var path	= require('path');
var mkdirp	= require('mkdirp');
var debug	= require('debug')('i18nc-test-req');

var ArraySlice = Array.prototype.slice;

exports = module.exports = requireAfterWrite;
exports.ROOT_PATH = __dirname + '/output';
exports.BUILD = false;

function requireAfterWrite(subpath)
{
	return function(filename)
	{
		var file = subpath + '/' + filename;
		var args = ArraySlice.call(arguments);
		args[0] = file;
		return requireAfterWriteReal.apply(this, args);
	};
}

exports.isBuild = isBuild;
function isBuild()
{
	return exports.BUILD || process.env.TEST_BUILD;
}

exports.requireAfterWriteReal = requireAfterWriteReal;
function requireAfterWriteReal(file, data)
{
	if (arguments.length == 1 || !isBuild()) return _require(file);

	var type = typeof data;
	switch(type)
	{
		case 'object':
			data = JSON.stringify(data, null, '\t');
			if (path.extname(file) == '.js')
			{
				data = 'module.exports = '+data;
			}
			break;

		case 'string':
			if (!/module\.exports *=/.test(data))
			{
				var codeLens = data.match(/\n\S+/g);
				if (data.substr(0, 8) == 'function'
					&& !_checkTextWrapCode(data)
					// 如果包含function，但内容有超过3行，那可能就不是单纯的func了
					&& (!codeLens || codeLens.length <= 3)
					&& /\};?\s*$/.test(data))
				{
					data = 'module.exports = '+data+'\n';
				}
				else
				{
					data = wrapCode4pkg(data);
				}
			}
			break;

		case 'function':
			data = 'module.exports = '+data.toString()+'\n';
			break;
	}

	var realfile = path.join(exports.ROOT_PATH, file);
	mkdirp.sync(path.dirname(realfile));
	fs.writeFileSync(realfile, data);

	debug('build write file:%s', realfile);

	return _require(file);
}

exports.resolve = resolve;
function resolve(file)
{
	return path.normalize(exports.ROOT_PATH + '/' + file);
}

function _require(file)
{
	file = resolve(file);
	// for browserify require key
	var data = require(file);

	if (typeof data == 'function')
	{
		var tmp = data.toString();
		if (_checkTextWrapCode(tmp))
		{
			return tmp.substr(26, tmp.length-26-3);
		}
	}

	return data;
}


exports.wrapCode4pkg = wrapCode4pkg;
function wrapCode4pkg(code)
{
	return 'module.exports = function textWrapCode(){\n\n'+code+'\n\n}\n';
}

function _checkTextWrapCode(code)
{
	return code.substr(0, 26) == 'function textWrapCode(){\n\n';
}

exports.code2arr = function code2arr(code)
{
	return code.toString().trim().split('\n')
		.filter(function(val)
		{
			return val.trim();
		});
}

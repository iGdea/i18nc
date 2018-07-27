'use strict';

var _ = require('lodash');
var fs = require('fs');
var path =  require('path');
var mkdirp = require('mkdirp');
var debug = require('debug')('i18nc-core:auto_test_utils');

exports.wrapCode4pkg = function(code)
{
	return 'module.exports = function textWrapCode(){\n\n'+code+'\n\n}\n';
};

exports.requireAfterWrite = function requireAfterWrite(subpath)
{
	var file_path = 'files/output/'+subpath;

	return function(filename, data, options)
	{
		var file = file_path+'/'+filename;
		return requireAfterWriteReal(file, data, options);
	};
}

exports.requireAfterWrite4node = function requireAfterWrite4node(subpath)
{
	var file_path = 'files/output_node/'+subpath;

	return function(filename, data, options)
	{
		var file = file_path+'/'+filename;
		return requireAfterWriteReal(file, data, options);
	};
}

exports.requireAfterWriteReal = requireAfterWriteReal;
function requireAfterWriteReal(file, data)
{
	if (!process.env.TEST_BUILD) return _require(file);

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
			if (data.substr(0, 14) != 'module.exports')
			{
				if (data.substr(0, 8) == 'function')
					data = 'module.exports = '+data+'\n';
				else
					data = exports.wrapCode4pkg(data);
			}
			break;

		case 'function':
			data = 'module.exports = '+data.toString()+'\n';
			break;
	}

	var realfile = path.join(__dirname, file);
	mkdirp.sync(path.dirname(realfile));
	fs.writeFileSync(realfile, data);

	debug('build write file:%s', realfile);

	return _require(file);
}

function _require(file)
{
	// var data = require(__dirname+'/'+file);
	// for browserify require key
	var data = require(path.normalize(__dirname+'/'+file));

	if (typeof data == 'function')
	{
		var tmp = data.toString();
		if (tmp.substr(0, 24) == 'function textWrapCode(){')
		{
			return tmp.substr(25, tmp.length-28);
		}
	}

	return data;
}


exports.code2arr = function code2arr(code)
{
	return code.toString().split('\n')
		.filter(function(val)
		{
			return val.trim();
		});
}

exports.JsonOfI18ncRet = function JsonOfI18ncRet(info)
{
	var obj = _.extend({}, info.words.toJSON(),
		{
			currentFileKey				: info.currentFileKey,
			originalFileKeys			: info.originalFileKeys,
			newWord4codeTranslateWords	: info.words.codeTranslateWords.list4newWords(),
			subScopeDatas				: _.map(info.subScopeDatas, exports.JsonOfI18ncRet),
		});

	var result = {};

	Object.keys(obj).sort().forEach(function(key)
	{
		result[key] = obj[key];
	});

	return result;
}

exports.getCodeTranslateAllWords = function getCodeTranslateAllWords(info)
{
	var translateWords = info.words.codeTranslateWords.allwords();
	info.subScopeDatas.forEach(function(info)
	{
		translateWords = translateWords.concat(exports.getCodeTranslateAllWords(info));
	});

	return _.uniq(translateWords).sort();
}

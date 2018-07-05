'use strict';

var _ = require('lodash');
var fs = require('fs');
var path =  require('path');
var mkdirp = require('mkdirp');

exports.requireAfterWrite = function requireAfterWrite(subpath)
{
	var file_path = 'files/output/'+subpath;

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
					data = 'module.exports = '+data;
				else
					data = 'module.exports = function textWrapCode(){\n'+data+'\n}';
			}
			break;

		case 'function':
			data = 'module.exports = '+data.toString();
			break;
	}

	mkdirp.sync(path.dirname(file));
	fs.writeFileSync(path.join(__dirname, file), data);

	return _require(file);
}

function _require(file)
{
	var data = require('./'+file);
	if (typeof data == 'function')
	{
		var tmp = data.toString();
		if (tmp.substr(0, 24) == 'function textWrapCode(){')
		{
			return tmp.substr(25, data.length-27);
		}
	}

	return data;
}


exports.code2arr = function code2arr(code)
{
	return code.split('\n')
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

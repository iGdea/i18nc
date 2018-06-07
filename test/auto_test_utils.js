'use strict';

var _ = require('lodash');
var fs = require('fs');
var mkdirp = require('mkdirp');


var SUB_PATHS =
{
	example: 'example',
	use_require: 'example/cases/use_require'
};

exports.requireAfterWrite = function requireAfterWrite(subpath)
{
	var file_path = 'files';
	if (subpath)
	{
		file_path = SUB_PATHS[subpath];
		if (!file_path)
		{
			file_path = 'files/'+subpath;
		}
	}

	return function(filename, data, options)
	{
		var file = __dirname+'/'+file_path+'/'+filename;

		if (!process.env.TEST_BUILD) return _requireOrFs(file, options);

		if (typeof data == 'object')
		{
			data = JSON.stringify(data, null, '\t');
		}

		mkdirp.sync(__dirname+'/'+file_path);
		fs.writeFileSync(file, data);

		return _requireOrFs(file, options);
	}
}

function _requireOrFs(file, options)
{
	options || (options = {});

	switch(options.readMode)
	{
		case 'string':
			return fs.readFileSync(file, {encoding: 'utf8'});

		default:
			return require(file);
	}
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

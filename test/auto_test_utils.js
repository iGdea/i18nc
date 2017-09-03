var _ = require('lodash');
var fs = require('fs');


var SUB_PATHS =
{
	example: 'example',
	use_require: 'example/cases/use_require'
};

exports.requireAfterWrite = function requireAfterWrite(subpath)
{
	var file_path = SUB_PATHS[subpath] || 'files';

	return function(filename, data, options)
	{
		var file = __dirname+'/'+file_path+'/'+filename;

		if (!process.env.TEST_BUILD) return _requireOrFs(file, options);

		if (typeof data == 'object')
		{
			data = JSON.stringify(data, null, '\t');
		}

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
	return {
		codeTranslateWords: info.codeTranslateWords,
		funcTranslateWords: info.funcTranslateWords,
		usedTranslateWords: info.usedTranslateWords
	};
}

exports.codeTranslateWords2words = function codeTranslateWords2words(codeTranslateWords)
{
	var translateWords = _.map(codeTranslateWords.SUBTYPES, function(val)
		{
			return val;
		});
	translateWords = [].concat.apply(codeTranslateWords.DEFAULTS, translateWords);

	return _.uniq(translateWords).sort();
}


var fs = require('fs');
var SUB_PATHS =
{
	example: 'example',
	use_require: 'example/cases/use_require'
};

exports.requireAfterWrite = function requireAfterWrite(filename, data, subpath, options)
{
	var file_path = SUB_PATHS[subpath] || 'files';
	var file = __dirname+'/'+file_path+'/'+filename;

	if (!process.env.TEST_BUILD) return _requireOrFs(file, options);

	if (typeof data == 'object')
	{
		data = JSON.stringify(data, null, '\t');
	}

	fs.writeFileSync(file, data);

	return _requireOrFs(file, options);
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

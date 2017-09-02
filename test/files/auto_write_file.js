var fs = require('fs');

module.exports = function write(filename, data, type)
{
	if (!process.env.TEST_BUILD) return;

	if (typeof data == 'object')
	{
		data = JSON.stringify(data, null, '\t');
	}

	var file_path = __dirname+'/';

	switch(type)
	{
		case 'example':
			file_path += '../example/';
			break;

		case 'use_require':
			file_path += 'use_require/';
			break;

		case 'ast_splice_literal':
			file_path += 'ast_splice_literal/';
			break;
	}

	fs.writeFileSync(file_path+filename, data);
}

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
			file_path += '../example/cases/use_require/';
			break;
	}

	fs.writeFileSync(file_path+filename, data);
}

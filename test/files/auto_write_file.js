var fs = require('fs');

module.exports = function write(filename, data, type)
{
    if (!process.env.TEST_BUILD) return;

    if (typeof data == 'object')
    {
        data = JSON.stringify(data, null, '\t');
    }

    var file_path = type == 'example' ? __dirname+'/../example/' : __dirname+'/';
    fs.writeFileSync(file_path+filename, data);
}

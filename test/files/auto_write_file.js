var fs = require('fs');

module.exports = function write(filename, data)
{
    if (!process.env.TEST_BUILD) return;

    if (typeof data == 'object')
    {
        data = JSON.stringify(data, null, '\t');
    }

    fs.writeFileSync(__dirname+'/'+filename, data);
}

var fs = require('fs');
var template = require('art-template');
var tplContent = fs.readFileSync(__dirname+'/i18n_function.tpl', {encoding: 'utf8'});
var functionTpl = template.compile(tplContent);

exports.render = function(data)
{
	return functionTpl(data).trim();
}

exports.parse = function(ast)
{

}

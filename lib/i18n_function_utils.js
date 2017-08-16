var fs			= require('fs');
var template	= require('art-template');
var tplContent	= fs.readFileSync(__dirname+'/i18n_function.tpl', {encoding: 'utf8'});
var functionTpl	= template.compile(tplContent);

exports.render = render;
function render(data)
{
	return functionTpl(data).trim();
}

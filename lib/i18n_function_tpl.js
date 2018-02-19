var fs				= require('fs');
var optionsUtils	= require('./options');
var esprima			= require('esprima');
var esmangle		= require('esmangle');
var escodegen		= require('escodegen');

function tpl2render(filename)
{
	var code = fs.readFileSync(__dirname+'/i18n_function_tpl/'+filename, {encoding: 'utf8'});

	// 对源码进行压缩
	var ast = esprima.parse(code);
	var result = esmangle.mangle(ast);
	var code2 = escodegen.generate(result,
		{
			format:
			{
				renumber: true,
				hexadecimal: true,
				escapeless: true,
				compact: true,
				semicolons: false,
				parentheses: false
			}
		})
		.replace(/\$TRANSLATE_JSON/, '\$TRANSLATE_JSON\n');

	return function(data)
	{
		return code2.replace(/\$(\w+)/g, function(all, key)
		{
			return data[key] || '';
		});
	};
}

exports.render = tpl2render('full.js');
exports.renderSimple = tpl2render('simple.js');

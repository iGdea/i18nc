var _ = require('underscore');
var esprima = require('esprima');
var escodegen = require('escodegen');
var Collecter = require('./lib/collecter');

var escodegenOptions =
{
    // comment: true,
    format:
    {
        escapeless: true
    }
};


module.exports = function(code, options)
{
	var ast = esprima.parse(code, {range: true});
	var collect = new Collecter(options).collect(ast);

	var newCode = [];
	var tmpCode = code;

	var dealAst = [];
	collect.i18nHanlderAst.forEach(function(item)
	{
		dealAst.push({type: 'i18nHandler', value: item});
	});

	collect.specialWordsAst.forEach(function(item)
	{
		dealAst.push({type: 'specialWord', value: item});
	});


	dealAst.sort(function(a, b)
		{
			return a.value.range[0] > b.value.range[0] ? -1 : 1;
		})
		.forEach(function(item)
		{
			var ast = item.value;
			var startPos = ast.range[0];
			var endPos = ast.range[1];

			switch(item.type)
			{
				case 'i18nHandler':
					newCode.unshift(tmpCode.slice(endPos));
					tmpCode = tmpCode.slice(0, startPos);
					break;

				case 'specialWord':
					newCode.unshift(
						escodegen.generate(ast.__i18n_replace_info__.newAst, escodegenOptions),
						tmpCode.slice(endPos)
					);

					tmpCode = tmpCode.slice(0, startPos);
					break;
			}
		});


	var result = tmpCode+newCode.join('');

	return result;
};

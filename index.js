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

	var defineFunctionArgAst = collect.defineFunctionArgAst.sort(function(a, b)
		{
			return a.range[0] > b.range[0] ? 1 : -1;
		})[0];

	if (defineFunctionArgAst) dealAst.push({type: 'defineFunctionArg', value: defineFunctionArgAst});

	collect.specialWordsAst.forEach(function(item)
	{
		dealAst.push({type: 'specialWord', value: item});
	});

	var i18nPlaceholder =
	{
		code: '',
		toString: function()
		{
			return this.code;
		}
	};


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
					newCode.unshift(tmpCode.slice(endPos).replace(/^\n+/g, '\n'));
					tmpCode = tmpCode.slice(0, startPos).replace(/\n+$/g, '\n');
					break;

				case'defineFunctionArg':
					startPos = ast.body.range[0]+1;
					newCode.unshift('\n\n', i18nPlaceholder, '\n\n\n', tmpCode.slice(startPos));
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


	i18nPlaceholder.code = 'function I18N(){}';
	var result = tmpCode+newCode.join('');
	if (!defineFunctionArgAst)
	{
		result = i18nPlaceholder + '\n\n\n' + result;
	}

	return result;
};

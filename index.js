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


	var fixIndex = 0;
	dealAst.sort(function(a, b)
		{
			return a.value.range[0] > b.value.range[0] ? 1 : -1;
		})
		.forEach(function(item)
		{
			var ast = item.value;
			var startPos = ast.range[0] - fixIndex;
			var endPos = ast.range[1] - fixIndex;

			switch(item.type)
			{
				case 'i18nHandler':
					newCode.push(tmpCode.slice(0, startPos));

					tmpCode = tmpCode.slice(endPos);
					fixIndex += endPos;
					break;

				case'defineFunctionArg':
					startPos = ast.body.range[0]+1-fixIndex;
					newCode.push(tmpCode.slice(0, startPos), i18nPlaceholder);

					tmpCode = tmpCode.slice(startPos);
					fixIndex += startPos;
					break;

				case 'specialWord':
					newCode.push(
						tmpCode.slice(0, startPos),
						escodegen.generate(ast.__i18n_replace_info__.newAst, escodegenOptions)
					);

					tmpCode = tmpCode.slice(endPos);
					fixIndex += endPos;
					break;
			}
		});


	i18nPlaceholder.code = 'function I18N(){}';
	var result = newCode.join('')+tmpCode;
	if (!defineFunctionArgAst)
	{
		result = i18nPlaceholder + result;
	}

	return result;
};

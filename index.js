var _ = require('underscore');
var esprima = require('esprima');
var escodegen = require('escodegen');
var Collecter = require('./lib/collecter');
var optionsUtils = require('./lib/options');

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
	options = optionsUtils.extend(options);

	var ast		= esprima.parse(code, {range: true});
	var collect	= new Collecter(options).collect(ast);

	var newCode			= [];
	var tmpCode			= code;
	var specialWords	= [];
	var dirtyWords		= [];
	var dealAst			= [];
	var defineFunctionArgAst;

	collect.i18nHanlderAst.forEach(function(item)
	{
		dealAst.push({type: 'i18nHandler', value: item});
	});

	if (!collect.i18nHanlderAst.length)
	{
		defineFunctionArgAst = collect.defineFunctionArgAst.sort(function(a, b)
			{
				return a.range[0] > b.range[0] ? 1 : -1;
			})[0];

		if (defineFunctionArgAst)
		{
			dealAst.push({type: 'defineFunctionArg', value: defineFunctionArgAst});
		}
	}

	collect.specialWordsAst.forEach(function(item)
	{
		specialWords.push(item.value);
		dealAst.push({type: 'specialWord', value: item});
	});

	collect.i18nArgs.forEach(function(args)
	{
		var args1 = args[0];

		if (args1)
		{
			if (args1.type == 'Literal')
			{
				specialWords.push(args1.value);
			}
			else
			{
				dirtyWords.push(escodegen.generate(args1, escodegenOptions));
			}
		}
	});


	// i18n 函数插入时机
	// 如果原来有这个函数，就替换
	// 如果没有，就尝试查到第一个define内
	// 如果没有define，就直接插入到文件开头
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
					newCode.push(tmpCode.slice(0, startPos), i18nPlaceholder);

					tmpCode = tmpCode.slice(endPos);
					fixIndex += endPos;
					break;

				case'defineFunctionArg':
					startPos = ast.body.range[0]+1-fixIndex;
					newCode.push(tmpCode.slice(0, startPos), '\n\n', i18nPlaceholder, '\n\n');

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
	var resultCode = newCode.join('')+tmpCode;
	if (!defineFunctionArgAst && !collect.i18nHanlderAst.length)
	{
		resultCode = i18nPlaceholder +'\n\n'+ resultCode;
	}

	return {
		code			: resultCode,
		dirtyWords		: dirtyWords,
		specialWords	: _.uniq(specialWords),
	};
};

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

	collect.specialWordsAst.sort(function(a, b)
		{
			return a.range[0] > b.range[0] ? -1 : 1;
		})
		.forEach(function(item)
		{
			if (!item) return;

			var startPos = item.range[0];
			var endPos = item.range[1];

			newCode.unshift(
				escodegen.generate(item.__i18n_replace_info__.newAst, escodegenOptions),
				tmpCode.slice(endPos)
			);

			tmpCode = tmpCode.slice(0, startPos);
		});

	return tmpCode+newCode.join('');
};

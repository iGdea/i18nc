var expect				= require('expect.js');
var optionsUtils		= require('../lib/options');
var requireAfterWrite	= require('./auto_test_utils').requireAfterWrite('ast_splice_literal');
var spliceLiteralUtils	= require('../lib/ast_splice_literal');


describe('#spliceLiteralAst', function()
{
	var options = optionsUtils.extend();

	function _item2val(arr)
	{
		return arr.map(function(item)
			{
				if (Array.isArray(item))
				{
					return _item2val(item);
				}
				else if (item.type == 'other')
				{
					var callee = item.ast.callee;
					if (callee)
					{
						return '[callee]'+callee.name;
					}
					else
					{
						return '[ast:'+item.ast.type+']';
					}
				}
				else
				{
					return item.value;
				}
			});
	}

	function _check(name, eqlArr, mode)
	{
		describe('#'+name, function()
		{
			var data = require('./files/ast_splice_literal/'+name+'.json');
			var options = optionsUtils.extend({spliceLiteralMode: mode || 'NONE'});

			it('#plusBinaryExpressionAst2arrWidthClear', function()
			{
				var arr = spliceLiteralUtils._plusBinaryExpressionAst2arrWidthClear(data, options);
				expect(_item2val(arr)).to.eql(eqlArr);

				var otherArr = requireAfterWrite(name+'_array.json', arr, 'ast_splice_literal');

				expect(arr).to.eql(otherArr);
			});

			it('#spliceLiteralAst', function()
			{
				var newAst = spliceLiteralUtils.spliceLiteralAst(data, options);

				var otherAst = requireAfterWrite(name+'_output.json', newAst, 'ast_splice_literal');

				expect(newAst).to.eql(otherAst);
			});
		});
	}

	// a+b+c
	_check('simple', ['abc']);
	// a+(b+c)
	_check('priority', ['abc']);
	// 1+2+a+b

	_check('number', [1, 2, 'ab']);
	// 1+a+b+(2+c+d)
	_check('priority_number_one', ['1ab2cd']);
	// 1+(2+a+b)
	_check('priority_number_one2', ['12ab']);
	// 1+2+a+b+(3+4+c+d)
	_check('priority_number', [1, 2, 'ab', [3, 4, 'cd']]);
	// 1+2+(3+a+b)
	_check('priority_number2', [1, 2, '3ab']);

	// 1*a+b+(2+c+d)
	_check('priority_number_multiply', ['[ast:BinaryExpression]', 'b2cd']);
	// 1*2+a+(3+b+c)
	_check('priority_number_multiply2', ['[ast:BinaryExpression]', 'a3bc']);
	// 1*2+3+(4+a+b)
	_check('priority_number_multiply3', ['[ast:BinaryExpression]', 3, '4ab']);
	// 1*2+3+4+a
	_check('number_multiply', ['[ast:BinaryExpression]', 3, 4, 'a']);
	// 1+2*3+4+a
	_check('number_multiply2', [1, '[ast:BinaryExpression]', 4, 'a']);

	// 1+2+a+I18N(1)
	// _check('i18n_none_number', [1, 2, '[ast:BinaryExpression]'], 'NONE');
});

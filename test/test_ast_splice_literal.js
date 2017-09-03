var _					= require('lodash');
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

	function _realCheck(name, eqlArr, mode)
	{
		mode = mode || 'LITERAL';
		var data = require('./files/ast_splice_literal/'+name+'.json');
		var options = optionsUtils.extend({spliceLiteralMode: mode});
		var mainFilename = mode == 'LITERAL' || mode == 'NODE' ? name : name + '_[mode]'+mode;

		it('#plusBinaryExpressionAst2arrWidthClear', function()
		{
			var arr = spliceLiteralUtils._plusBinaryExpressionAst2arrWidthClear(data, options);
			expect(_item2val(arr)).to.eql(eqlArr);

			var otherArr = requireAfterWrite(mainFilename+'_array.json', arr, 'ast_splice_literal');

			expect(arr).to.eql(otherArr);
		});

		it('#spliceLiteralAst', function()
		{
			var newAst = spliceLiteralUtils.spliceLiteralAst(data, options);

			var otherAst = requireAfterWrite(mainFilename+'_output.json', newAst, 'ast_splice_literal');

			expect(newAst).to.eql(otherAst);
		});
	}

	function _checkOne(name)
	{
		var args = arguments;
		describe('#'+name, function()
		{
			_realCheck.apply(this, args);
		});
	}


	function _checkAll(name, eqlObj)
	{
		describe('#'+name, function()
		{
			_.each(eqlObj, function(eqlArr, mode)
			{
				describe('#mode:'+mode, function()
				{
					_realCheck(name, eqlArr, mode);
				});
			});
		});
	}

	// a+b+c
	_checkOne('simple', ['abc']);
	// a+(b+c)
	_checkOne('priority', ['abc']);
	// 1+2+a+b
	_checkOne('number', [1, 2, 'ab']);

	// 1+2+var1+a+b
	_checkOne('number_var', [1, 2, '[ast:Identifier]', 'ab']);
	// 1+var1+2+a+b
	_checkOne('number_var2', [1, '[ast:Identifier]', 2, 'ab']);

	// 1+a+b+(2+c+d)
	_checkOne('priority_number_one', ['1ab2cd']);
	// 1+(2+a+b)
	_checkOne('priority_number_one2', ['12ab']);
	// 1+2+a+b+(3+4+c+d)
	_checkOne('priority_number', [1, 2, 'ab', [3, 4, 'cd']]);
	// 1+2+(3+a+b)
	_checkOne('priority_number2', [1, 2, '3ab']);

	// 1*a+b+(2+c+d)
	_checkOne('priority_number_multiply', ['[ast:BinaryExpression]', 'b2cd']);
	// 1*2+a+(3+b+c)
	_checkOne('priority_number_multiply2', ['[ast:BinaryExpression]', 'a3bc']);
	// 1*2+3+(4+a+b)
	_checkOne('priority_number_multiply3', ['[ast:BinaryExpression]', 3, '4ab']);
	// 1*2+3+4+a
	_checkOne('number_multiply', ['[ast:BinaryExpression]', 3, 4, 'a']);
	// 1+2*3+4+a
	_checkOne('number_multiply2', [1, '[ast:BinaryExpression]', 4, 'a']);

	// 1+2+a+I18N(3)
	_checkAll('i18n_number',
		{
			LITERAL		: [1, 2, 'a', '[callee]I18N'],
			I18N		: [1, 2, 'a3'],
			ALL_I18N	: [1, 2, 'a3'],
		});

	// 1+2+a+I18N(b)
	_checkAll('i18n_string',
		{
			LITERAL		: [1, 2, 'a', '[callee]I18N'],
			I18N		: [1, 2, 'ab'],
			ALL_I18N	: [1, 2, 'ab'],
		});

	// 1+I18N(2)+3+a
	_checkAll('i18n_string2',
		{
			LITERAL		: [1, '[callee]I18N', 3, 'a'],
			I18N		: ['123a'],
			ALL_I18N	: ['123a'],
		});

	// 1+2+a+I18N(var1)
	_checkAll('i18n_var',
		{
			LITERAL		: [1, 2, 'a', '[callee]I18N'],
			I18N		: [1, 2, 'a', '[callee]I18N'],
			ALL_I18N	: [1, 2, 'a', '[callee]I18N'],
		});

	// 1+2+a+I18N(b,subtype)
	_checkAll('i18n_subtype',
		{
			LITERAL		: [1, 2, 'a', '[callee]I18N'],
			I18N		: [1, 2, 'a', '[callee]I18N'],
			ALL_I18N	: [1, 2, 'ab'],
		});
});

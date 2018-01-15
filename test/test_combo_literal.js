var _				= require('lodash');
var debug			= require('debug')('i18nc-core:test_combo_literal');
var expect			= require('expect.js');
var escodegen		= require('escodegen');
var i18nc			= require('../');
var optionsUtils	= require('../lib/options');
var astComboLiteral	= require('../lib/plugins/combo_literal/combo_literal');


describe('#astComboLiteral', function()
{
	function _str2code(str)
	{
		return str.replace(/\b(\d*[a-z]\d*)+\b/g, function(val)
			{
				return '"'+val+'"';
			});
	}


	describe('#combo', function()
	{
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

		/**
		 * @param  {String} codeStr 表达式code
		 * 								code字符串使用小写的字母表示
		 * 								变量或则函数，使用大写的字幕表示
		 *
		 * @param  {Object} eqlInfo 期望的结果值
		 * 								combo 合并后的数组
		 * 								comboCode 通过combo合成的ast生成的code（表达式，同上）
		 * @param  {String} mode    comboLiteralMode值
		 */
		function _realCheck(codeStr, eqlInfo, mode)
		{
			mode = mode || 'LITERAL';
			var code = _str2code(codeStr);
			debug('new code:%s', code);

			var data = i18nc.parse(code).body[0].expression;
			var options = optionsUtils.extend({comboLiteralMode: mode});


			it('#plusBinaryExpressionAst2arrWidthClear', function()
			{
				var arr = astComboLiteral._plusBinaryExpressionAst2arrWidthClear(data, options);
				expect(_item2val(arr)).to.eql(eqlInfo.combo);
			});

			it('#combo', function()
			{
				var newAst = astComboLiteral.combo(data, options);

				var escodegenOptions = {format:{quotes: 'double'}};
				var newCode = escodegen.generate(newAst, escodegenOptions).replace(/\s/g, '');
				expect(newCode).to.be(_str2code(eqlInfo.comboCode));
			});
		}

		function _checkOne(codeStr)
		{
			var args = arguments;
			describe('#expr:'+codeStr, function()
			{
				_realCheck.apply(this, args);
			});
		}


		function _checkAll(codeStr, eqlObj)
		{
			describe('#expr:'+codeStr, function()
			{
				_.each(eqlObj, function(eqlInfo, mode)
				{
					describe('#mode:'+mode, function()
					{
						_realCheck(codeStr, eqlInfo, mode);
					});
				});
			});
		}



		describe('#base', function()
		{
			_checkOne('a+b+c',
				{
					combo		: ['abc'],
					comboCode	: 'abc'
				});
			_checkOne('a+(b+c)',
				{
					combo: ['abc'],
					comboCode: 'abc'
				});
			_checkOne('1+2+a+b',
				{
					combo: [1, 2, 'ab'],
					comboCode: '1+2+ab'
				});
		});


		describe('#var', function()
		{
			_checkOne('1+2+Var1+a+b',
				{
					combo: [1, 2, '[ast:Identifier]', 'ab'],
					comboCode: '1+2+Var1+ab'
				});
			_checkOne('1+Var1+2+a+b',
				{
					combo: [1, '[ast:Identifier]', 2, 'ab'],
					comboCode: '1+Var1+2+ab'
				});
		});


		describe('#run handler', function()
		{
			_checkOne('1+Run(2)+3+a',
				{
					combo: [1, '[callee]Run', 3, 'a'],
					comboCode: '1+Run(2)+3+a'
				});
		});


		describe('#priority', function()
		{
			_checkOne('1+a+b+(2+c+d)',
				{
					combo: ['1ab2cd'],
					comboCode: '1ab2cd'
				});
			_checkOne('1+(2+a+b)',
				{
					combo: ['12ab'],
					comboCode: '12ab'
				});
			_checkOne('1+2+a+b+(3+4+c+d)',
				{
					combo: [1, 2, 'ab', [3, 4, 'cd']],
					comboCode: '1+2+ab+(3+4+cd)'
				});
			_checkOne('1+2+(3+a+b)',
				{
					combo: [1, 2, '3ab'],
					comboCode: '1+2+3ab'
				});
		});

		describe('#other operator', function()
		{
			_checkOne('1*a+b+(2+c+d)',
				{
					combo: ['[ast:BinaryExpression]', 'b2cd'],
					comboCode: '1*a+b2cd'
				});
			_checkOne('1*2+a+(3+b+c)',
				{
					combo: ['[ast:BinaryExpression]', 'a3bc'],
					comboCode: '1*2+a3bc'
				});
			_checkOne('1*2+3+(4+a+b)',
				{
					combo: ['[ast:BinaryExpression]', 3, '4ab'],
					comboCode: '1*2+3+4ab'
				});
			_checkOne('1*2+3+4+a',
				{
					combo: ['[ast:BinaryExpression]', 3, 4, 'a'],
					comboCode: '1*2+3+4+a'
				});
			_checkOne('1+2*3+4+a',
				{
					combo: [1, '[ast:BinaryExpression]', 4, 'a'],
					comboCode: '1+2*3+4+a'
				});
		});


		describe('#I18N', function()
		{
			_checkAll('1+2+a+I18N(3)',
				{
					LITERAL:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(3)'
					},
					I18N:
					{
						combo: [1, 2, 'a3'],
						comboCode: '1+2+a3'
					},
					ALL_I18N:
					{
						combo: [1, 2, 'a3'],
						comboCode: '1+2+a3'
					}
				});

			_checkAll('1+2+a+I18N(b)',
				{
					LITERAL:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(b)'
					},
					I18N:
					{
						combo: [1, 2, 'ab'],
						comboCode: '1+2+ab'
					},
					ALL_I18N:
					{
						combo: [1, 2, 'ab'],
						comboCode: '1+2+ab'
					}
				});

			_checkAll('1+I18N(2)+3+a',
				{
					LITERAL:
					{
						combo: [1, '[callee]I18N', 3, 'a'],
						comboCode: '1+I18N(2)+3+a'
					},
					I18N:
					{
						combo: ['123a'],
						comboCode: '123a'
					},
					ALL_I18N:
					{
						combo: ['123a'],
						comboCode: '123a'
					}
				});

			_checkAll('1+2+a+I18N(Var1)',
				{
					LITERAL:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(Var1)'
					},
					I18N:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(Var1)'
					},
					ALL_I18N:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(Var1)'
					}
				});

			_checkAll('1+2+a+I18N(b,subtype)',
				{
					LITERAL:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(b,subtype)'
					},
					I18N:
					{
						combo: [1, 2, 'a', '[callee]I18N'],
						comboCode: '1+2+a+I18N(b,subtype)'
					},
					ALL_I18N:
					{
						combo: [1, 2, 'ab'],
						comboCode: '1+2+ab'
					}
				});
		});
	});




	describe('#revert', function()
	{
		var options = optionsUtils.extend();
		var ast = i18nc.parse(_str2code('ab+cd+12+34+abcd+1234')).body[0].expression;
		var comboAsts = astComboLiteral.combo(ast, options).__i18n_combo_asts__;

		function _genIt(name, dealWordsArr, eqlObj)
		{
			it('#'+name, function()
			{
				var result = astComboLiteral.revert(dealWordsArr, comboAsts, options);

				var translateWords = [];
				var astValues = [];
				result.forEach(function(item)
				{
					var subTranslateWords = [];
					item.lineStrings.forEach(function(item)
					{
						if (item.translateWord) subTranslateWords.push(item.value);
					});

					translateWords.push(subTranslateWords);
					astValues.push(item.ast.value);
				});

				expect(translateWords).to.eql(eqlObj.translateWords);
				expect(astValues).to.eql(eqlObj.astValues);
			});
		}

		describe('#rev:1:1', function()
		{
			_genIt('middle',
				[
					{translateWord: false, value: 'ab'},
					{translateWord: true, value: 'cd'},
					{translateWord: false, value: '1234abcd1234'}
				],
				{
					translateWords: [['cd']],
					astValues: ['cd'],
				});

			_genIt('head',
				[
					{translateWord: true, value: 'ab'},
					{translateWord: false, value: 'cd1234abcd1234'}
				],
				{
					translateWords: [['ab']],
					astValues: ['ab'],
				});

			_genIt('mulit',
				[
					{translateWord: true, value: 'ab'},
					{translateWord: false, value: 'cd'},
					{translateWord: true, value: '12'},
					{translateWord: false, value: '34abcd1234'}
				],
				{
					translateWords: [['ab'], ['12']],
					astValues: ['ab', '12'],
				});

			_genIt('continue',
				[
					{translateWord: true, value: 'ab'},
					{translateWord: true, value: 'cd'},
					{translateWord: true, value: '12'},
					{translateWord: false, value: '34abcd1234'}
				],
				{
					translateWords: [['ab'], ['cd'], ['12']],
					astValues: ['ab', 'cd', '12'],
				});

			_genIt('only one',
				[
					{translateWord: true, value: 'ab'},
					{translateWord: false, value: 'cd'},
					{translateWord: false, value: '12'},
					{translateWord: false, value: '34abcd1234'}
				],
				{
					translateWords: [['ab']],
					astValues: ['ab'],
				});

			_genIt('part',
				[
					{translateWord: false, value: 'a'},
					{translateWord: true, value: 'b'},
					{translateWord: false, value: 'cd1234abcd1234'}
				],
				{
					translateWords: [['b']],
					astValues: ['ab'],
				});
		});


		describe('#rev:1:n', function()
		{
			_genIt('middle',
				[
					{translateWord: false, value: 'ab'},
					{translateWord: true, value: 'cd12'},
					{translateWord: false, value: '34abcd1234'}
				],
				{
					translateWords: [['cd12']],
					astValues: ['cd12'],
				});

			_genIt('head',
				[
					{translateWord: true, value: 'abcd12'},
					{translateWord: false, value: '34abcd1234'}
				],
				{
					translateWords: [['abcd12']],
					astValues: ['abcd12'],
				});
		});


		describe('#rev:n:1', function()
		{
			_genIt('continue',
				[
					{translateWord: true, value: 'a'},
					{translateWord: true, value: 'b'},
					{translateWord: false, value: 'cd1234abcd1234'}
				],
				{
					translateWords: [['a', 'b']],
					astValues: ['ab'],
				});

			_genIt('more',
				[
					{translateWord: true, value: 'a'},
					{translateWord: true, value: 'b'},
					{translateWord: false, value: 'cd1234'},
					{translateWord: false, value: 'a'},
					{translateWord: true, value: 'b'},
					{translateWord: false, value: 'c'},
					{translateWord: true, value: 'd'},
					{translateWord: false, value: '1234'},
				],
				{
					translateWords: [['a', 'b'], ['b', 'd']],
					astValues: ['ab', 'abcd'],
				});
		});

		describe('#rev:n:n', function()
		{
			_genIt('len:2',
				[
					{translateWord: false, value: 'a'},
					{translateWord: true, value: 'bc'},
					{translateWord: false, value: 'd1234abcd1234'}
				],
				{
					translateWords: [['bc']],
					astValues: ['abcd'],
				});

			_genIt('len:3',
				[
					{translateWord: false, value: 'a'},
					{translateWord: true, value: 'bcd1'},
					{translateWord: false, value: '234abcd1234'}
				],
				{
					translateWords: [['bcd1']],
					astValues: ['abcd12'],
				});

		});
	});
});

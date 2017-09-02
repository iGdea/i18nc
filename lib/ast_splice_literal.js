var debug		= require('debug')('i18nc:ast_splice_literal');
var astTpl		= require('./ast_tpl');
var astUtils	= require('./ast_utils');
var AST_FLAGS	= astUtils.AST_FLAGS;
var ArrayPush	= Array.prototype.push;

// 合并 + 号的字符
// 注意：只有发生改变的情况下，才返回数据
exports.spliceLiteralAst = function spliceLiteralAst(ast, options)
{
	var arr = _plusBinaryExpressionAst2arrWidthClear(ast, options);

	// 将数组表示，转换为ast返回
	// 同时要计算新的range
	var asts = _arr2newAsts(arr);

	return astUtils.asts2plusExpression(asts);
}


/**
 * 将_plusBinaryExpressionAst2arrWidthClear结果，转换成纯ast的数组
 * 过程中会重新生成合并的combo的ast，计算range
 */
function _arr2newAsts(mainArr)
{
	return mainArr.map(function(item)
		{
			if (Array.isArray(item))
			{
				return _arr2newAsts(item);
			}

			if (item.comboAst)
			{
				var ast = astTpl.Literal(item.value);
				astUtils.setAstFlag(ast, AST_FLAGS.FROM_SPLICED_LITERAL);
				var comboAst = item.comboAst = item.comboAst.sort(function(a, b)
					{
						return a.range[0] > b.range[0] ? 1 : -1;
					});
				ast.range = [comboAst[0].range[0], comboAst[comboAst.length-1].range[1]];

				return ast;
			}

			return item.ast;
		});
}


/**
 * 同_plusBinaryExpressionAst2arr，只是增加对可合并数据的合并
 */
exports._plusBinaryExpressionAst2arrWidthClear = _plusBinaryExpressionAst2arrWidthClear;
function _plusBinaryExpressionAst2arrWidthClear(ast, options)
{
	var arr = _plusBinaryExpressionAst2arr(ast, options);
	debug('plusBinaryExpressionAst2arr: %o', arr);

	return _spliceLiteralText(arr);
}

/**
 * 合并_plusBinaryExpressionAst2arr结果
 * 输出的结构体，存在item.ast item.comboAst两种情况
 */
function _spliceLiteralText(mainArr)
{
	var result = [];
	var comboArr = [];
	var firstNumberItem;
	var isStringStart = false;

	function _end()
	{
		if (firstNumberItem)
		{
			if (isStringStart)
			{
				comboArr.push(firstNumberItem);
			}
			else
			{
				result.push(firstNumberItem);
			}

			firstNumberItem = null;
		}

		if (comboArr.length)
		{
			if (comboArr.length == 1)
			{
				result.push(comboArr[0]);
			}
			else
			{
				var astArr = [];
				var value = '';

				comboArr.forEach(function(item)
				{
					value += item.value;

					if (item.ast)
					{
						astArr.push(item.ast);
					}
					else if (item.comboAst)
					{
						ArrayPush.apply(astArr, item.comboAst);
					}
				});

				result.push(
					{
						type: 'string',
						value: value,
						comboAst: astArr
					});
			}

			comboArr = [];
		}
	}

	function _itemHandler(item, index)
	{
		switch(item.type)
		{
			case 'number':
				if (index === 0)
				{
					firstNumberItem = item;
				}
				else if (isStringStart)
				{
					comboArr.push(item);
				}
				else
				{
					if (firstNumberItem)
					{
						result.push(firstNumberItem);
						firstNumberItem = null;
					}
					result.push(item);
				}
				break;

			case 'string':
				isStringStart = true;

				if (firstNumberItem)
				{
					comboArr.push(firstNumberItem);
					firstNumberItem = null;
				}
				comboArr.push(item);
				break;

			default:
				_end();
				result.push(item);
		}
	}


	mainArr.forEach(function(item, index)
	{
		if (Array.isArray(item))
		{
			var subResult = _spliceLiteralText(item);
			var isSubFistNumber = false;
			var isStopCombo = subResult.some(function(item, index)
				{
					switch(item.type)
					{
						case 'string':
							return false;

						case 'number':
							if (index === 0)
							{
								isSubFistNumber = true;
								return false;
							}
							else if (index === 1)
							{
								return isSubFistNumber;
							}
							else
							{
								return false;
							}
					}

					return true;
				});

			debug('stop combo:%d, subResult:%o', isStopCombo, subResult);

			if (isStopCombo)
			{
				_end();
				result.push(subResult);
			}
			else
			{
				subResult.forEach(_itemHandler);
			}
		}
		else
		{
			_itemHandler(item, index);
		}
	});

	_end();

	return result;
}


/**
 * 将+号预算转换成array数据结构
 * 原样转换，不会进行合并
 *
 * 如果ast出现（）运算，就用子数组表示
 *
 * 例如：
 * 1+2+3+(4+5) => [1,2,3,[4,5]]
 */
function _plusBinaryExpressionAst2arr(ast, options)
{
	if (ast.type != 'BinaryExpression' || ast.operator != '+')
	{
		return [{type: 'other', ast: ast}];
	}

	var result = [];
	var ret = _appendBinaryExpression(ast.left, options);
	ArrayPush.apply(result, ret);


	// 根据返回参数个数，如果多余一个
	// 那么表示有（）运算，需要独立出一个空间保存
	ret = _appendBinaryExpression(ast.right, options);
	if (ret.length == 1)
	{
		result.push(ret[0]);
	}
	else
	{
		result.push(ret);
	}

	return result;
}

function _appendBinaryExpression(ast, options)
{
	var result = [];
	switch(ast.type)
	{
		case 'Literal':
			result.push(
				{
					type: typeof ast.value,
					value: ast.value,
					ast: ast
				});
			break;

		case 'CallExpression':
			if (options.spliceLiteralMode == 'I18N'
			 	|| options.spliceLiteralMode == 'ALL_I18N')
			{
				var calleeName = ast.callee && ast.callee.name;
				var arg0ast = ast.arguments && ast.arguments[0];
				if (calleeName == options.handlerName
					&& arg0ast
					&& arg0ast.type == 'Literal')
				{
					if (ast.arguments.length == 1
						|| options.spliceLiteralMode == 'ALL_I18N')
					{
						result.push(
							{
								type: 'string',
								value: arg0ast.value,
								ast: ast,
							});
						// 除了这情况下，其他的情况都没有break
						// 其他情况会跳转到default
						break;
					}
				}
			}

		case 'BinaryExpression':
			result = _plusBinaryExpressionAst2arr(ast, options);
			break;

		default:
			if (ast.type == 'CallExpression')
			{
				debug('no ast info for call %s', ast.callee && ast.callee.name);
			}

			result.push(
			{
				type: 'other',
				ast: ast
			});
	}

	return result;
}

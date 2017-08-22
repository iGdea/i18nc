var _				= require('lodash');
var debug			= require('debug')('i18nc:ast_collector');
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
var ArrayPush		= Array.prototype.push;

var BLOCK_MODIFIER	= optionsUtils.BLOCK_MODIFIER;
var AST_FLAGS		= astUtils.AST_FLAGS;


exports.ASTCollector = ASTCollector;

function ASTCollector(options)
{
	this.options = optionsUtils.extend(options);
}

_.extend(ASTCollector.prototype,
{
	collect: function(ast)
	{
		var collect =
		{
			defineFunctionArgAsts: [],
			i18nHanlderAsts: [],
			i18nArgs: []
		};

		collect.translateWordAsts = this.scan(collect, ast) || [];

		return collect;
	},

	warpTxt2caller: function(txt)
	{
		var ast = astUtils.CallExpressionAst(this.options.handlerName, [this.warpTxt(txt)]);
		astUtils.setAstFlag(ast, AST_FLAGS.SELF_CREATED)
		return ast;
	},

	warpTxt: function(txt)
	{
		var ast = astUtils.LiteralAst(txt);
		astUtils.setAstFlag(ast, AST_FLAGS.SELF_CREATED)
		return ast;
	},

	// 将文本结构体整理成ast的数组
	txtarr: function(arr)
	{
		if (!arr || !arr.length) return;

		var firstValue;
		var isFirstTranslateWord;
		var nextValue;
		var endIndex = -1;

		arr.some(function(item, index)
		{
			if (!item || !item.value) return;

			if (!firstValue)
			{
				firstValue = item.value;
				isFirstTranslateWord = item.translateWord;
			}
			else if (!nextValue)
			{
				if (item.translateWord == isFirstTranslateWord)
				{
					firstValue += item.value;
				}
				else
				{
					nextValue = item.value;
				}
			}
			else
			{
				if (item.translateWord == isFirstTranslateWord)
				{
					endIndex = index;
					return true;
				}
				else
				{
					nextValue += item.value;
				}
			}
		});

		if (!firstValue) return;

		var result = [];
		result.push(isFirstTranslateWord ? this.warpTxt2caller(firstValue) : this.warpTxt(firstValue));
		if (!nextValue) return result;

		result.push(isFirstTranslateWord ? this.warpTxt(nextValue) : this.warpTxt2caller(nextValue));

		var children = endIndex != -1 && this.txtarr(arr.slice(endIndex));
		if (children) result = result.concat(children);

		return result;
	},

	// 将Txtarr结果，加上“+”运算
	wrapTxtarr: function(arr)
	{
		if (!arr || !arr.length) return;
		if (arr.length == 1) return arr[0];


		// var result = arr.pop();
		// for(var i = arr.length; i--;)
		// {
		//     result =
		//     {
		//         "type": "BinaryExpression",
		//         "operator": "+",
		//         "left": arr[i],
		//         "right": result
		//     }
		// }

		var result = arr.shift();
		arr.forEach(function(item)
		{
			var ast = astUtils.BinaryExpressionAst(result, item);
			astUtils.setAstFlag(ast, AST_FLAGS.SELF_CREATED)
			result = ast;
		});

		return result;
	},


	scan: function(collect, ast, parent, itemName)
	{
		if (!ast || astUtils.checkAstFlag(ast, AST_FLAGS.SELF_CREATED))
		{
			return;
		}

		var self = this;


		// 定义I18N
		if (ast.type == 'FunctionDeclaration'
			&& ast.id && ast.id.name == self.options.handlerName)
		{
			collect.i18nHanlderAsts.push(ast);
			return;
		}

		// 如果发现define函数，就留心一下，可能要插入I18N函数
		if (ast.type == 'CallExpression'
			&& ast.callee && ast.callee.name == 'define')
		{
			ast.arguments.some(function(item)
			{
				if (item.type == 'FunctionExpression')
				{
					collect.defineFunctionArgAsts.push(item);
					return true;
				}
			});
		}

		// 调用I18N
		if (ast.type == 'CallExpression'
			&& ast.callee.name == self.options.handlerName)
		{
			collect.i18nArgs.push(ast.arguments);
			return;
		}

		if (ast.type == 'Literal')
		{
			var ret = self.dealLiteral(ast, parent, itemName);
			return ret && [ret];
		}

		var blockModifier = self._getBlockModifier(ast);
		if (blockModifier == BLOCK_MODIFIER.SKIP_SACN)
		{
			astUtils.setAstFlag(ast, AST_FLAGS.SKIP_SACN);
			debug('skip scan, body len:%s', ast.body.length);
			return;
		}

		var result = [];
		_.each(ast, function(item, ast_key)
		{
			var result2;
			if (Array.isArray(item))
			{
				result2 = [];
				var isObjectProperty = ast.type == 'ObjectExpression' && ast_key == 'properties';
				item.forEach(function(ast2, index)
				{
					var ret = self.scan(collect, ast2, item, index);
					if (isObjectProperty && ast2.key.__i18n_replace_info__)
					{
						var astIndex = ret ? ret.indexOf(ast2.key) : -1;

						// 需要从结果中删除key的ast，如果没有在ret中找到ast
						// 那么不执行忽略
						if (astIndex != -1 && self.options.isIgnoreScanWarn)
						{
							ret.splice(astIndex, 1);
							delete ast2.key.__i18n_replace_info__;
							astUtils.setAstFlag(ast2.key, AST_FLAGS.CAN_NOT_REPLACED);

							debug('Ignore not replace property key error.%s', self._getAstLocInfo(ast));
						}
						else
						{

							throw new Error("[I18N] Object property can't use i18n."+self._getAstLocInfo(ast));
						}
					}

					if (ret && ret.length)
					{
						ArrayPush.apply(result2, ret);
					}
				});
			}
			else if (typeof item == 'object')
			{
				result2 = self.scan(collect, item, ast, ast_key);
			}

			if (result2 && result2.length)
			{
				ArrayPush.apply(result, result2);

				// 不替换成函数
				if (blockModifier == BLOCK_MODIFIER.SKIP_REPLACE)
				{
					result2.forEach(function(item)
					{
						astUtils.setAstFlag(item, AST_FLAGS.SKIP_REPLACE);
						debug('skip replace %s', self._getAstLocInfo(item));
					});
				}
			}
		});

		if (result.length) return result;
	},

	dealLiteral: function(ast, parent, itemName)
	{
		var value = ast.value;
		// case 有可能不是string
		if (!value || typeof value != 'string') return;

		// 正则说明
		// 必须要有非accii之外的祝福（当作是中文）
		// 同时包含非html标签的其他字符
		var splitTranslateWordArr = value.split(this.options.cutWordReg);
		if (splitTranslateWordArr.length < 2) return;


		var translateWords = value.match(this.options.cutWordReg);
		var dealArr = [];
		// translateWords 必然比splitTranslateWordArr少一个
		translateWords.forEach(function(val, index)
		{
			dealArr.push(
				{translateWord: false, value: splitTranslateWordArr[index]},
				{translateWord: true, value: val}
			);
		});

		dealArr.push({translateWord: false, value: splitTranslateWordArr.pop()});

		var result = this.wrapTxtarr(this.txtarr(dealArr));
		if (result)
		{
			ast.__i18n_replace_info__ =
			{
				parent			: parent,
				itemName		: itemName,
				newAst			: result,
				translateWords	: translateWords
			};

			return ast;
		}
	},


	// 获取块的描述符
	// 必须是{}之间的第一行
	_getBlockModifier: function(ast)
	{
		if (ast.type == 'BlockStatement' && ast.body)
		{
			var astBodyFirst = ast.body[0];

			return astBodyFirst
				&& astBodyFirst.type == 'ExpressionStatement'
				&& astBodyFirst.expression
				&& astBodyFirst.expression.type == 'Literal'
				&& astBodyFirst.expression.value;
		}
	},
	// 获取ast的位置
	// 用于日志输出
	_getAstLocInfo: function(ast)
	{
		if (ast.loc)
			return ' Loc:'+ast.loc.start.line+','+ast.loc.start.column;
		else
			return '';
	},
});

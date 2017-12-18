var _					= require('lodash');
var debug				= require('debug')('i18nc-core:ast_collector');
var astUtils			= require('./ast_utils');
var astTpl				= require('./ast_tpl');
var emitter				= require('./emitter').emitter;
var optionsUtils		= require('./options');
var ASTFunctionScope	= require('./ast_function_scope').ASTFunctionScope;
var astComboLiteral		= require('./plugins/ast_combo_literal');
var ArrayPush			= Array.prototype.push;

var BLOCK_MODIFIER		= optionsUtils.BLOCK_MODIFIER;
var AST_FLAGS			= astUtils.AST_FLAGS;


exports.ASTCollector = ASTCollector;

function ASTCollector(options)
{
	this.options = options;
}

_.extend(ASTCollector.prototype,
{
	collect: function(ast, scopeType)
	{
		var scope = new ASTFunctionScope(ast, scopeType);
		scope.translateWordAsts = this.scan(scope, ast) || [];

		return scope;
	},

	_warpTxt2caller: function(txt)
	{
		return astTpl.CallExpression(this.options.handlerName, [astTpl.Literal(txt)]);
	},

	// 将文本结构体整理成ast的数组
	_txts2asts: function(txts)
	{
		if (!txts || !txts.length) return;

		var firstValue;
		var isFirstTranslateWord;
		var nextValue;
		var endIndex = -1;

		txts.some(function(item, index)
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
		result.push(isFirstTranslateWord ? this._warpTxt2caller(firstValue) : astTpl.Literal(firstValue));
		if (!nextValue) return result;

		result.push(isFirstTranslateWord ? astTpl.Literal(nextValue) : this._warpTxt2caller(nextValue));

		var children = endIndex != -1 && this._txts2asts(txts.slice(endIndex));
		if (children) result = result.concat(children);

		return result;
	},


	scan: function(scope, ast)
	{
		var self = this;

		if (!ast || (astUtils.checkAstFlag(ast, AST_FLAGS.SELF_CREATED)
			&& !astUtils.checkAstFlag(ast, AST_FLAGS.FROM_SPLICED_LITERAL)))
		{
			return;
		}

		switch(ast.type)
		{
			case 'FunctionDeclaration':
				// 定义I18N
				var handlerName = ast.id && ast.id.name;
				if (handlerName == self.options.handlerName)
				{
					scope.i18nHanlderAsts.push(ast);
				}
				else if (handlerName && self.options.ignoreScanFunctionNames.indexOf(handlerName) != -1)
				{
					debug('ignore scan function body %s.%s', handlerName, astUtils.getAstLocStr(ast));
				}
				else
				{
					scope.subScopes.push(self.collect(ast.body));
				}

				return;
				break;

			case 'CallExpression':
				var calleeName = ast.callee && ast.callee.name;

				// 如果发现define函数，就留心一下，可能要插入I18N函数
				// 注意：
				// 只处理直接在define里面插入function的情况
				// 如果是通过变量方式代入funtion，就忽略
				if (calleeName == 'define')
				{
					var ret = ast.arguments.some(function(item)
					{
						if (item.type == 'FunctionExpression')
						{
							scope.subScopes.push(self.collect(item.body, 'define factory'));
							return true;
						}
					});

					// 如果define调用的时候，有function，那么就不处理其他参数了
					if (ret) return;
				}
				// 调用I18N
				else if (calleeName == self.options.handlerName)
				{
					scope.i18nArgs.push(ast.arguments);
					return;
				}

				// 看一下，是否需要忽略
				if (calleeName && self.options.ignoreScanFunctionNames.indexOf(calleeName) != -1)
				{
					debug('ignore scan function args %s.%s', calleeName, astUtils.getAstLocStr(ast));
					return;
				}
				break;

			case 'Literal':
				return self._dealLiteral(ast);
				break;


			// 检查是否可以进行合并
			case 'BinaryExpression':
				var splicedLiteralAst = self._comboLiteral(ast);
				if (splicedLiteralAst && astUtils.checkAstFlag(splicedLiteralAst, AST_FLAGS.FROM_SPLICED_LITERAL))
				{
					return self.scan(scope, splicedLiteralAst);
				}
				break;
		}


		var blockModifier = self._getBlockModifier(ast);
		if (blockModifier == BLOCK_MODIFIER.SKIP_SACN
			|| blockModifier == BLOCK_MODIFIER.SKIP_SACN+'@'+self.options.handlerName)
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
					var ret = self.scan(scope, ast2, item, index);
					if (isObjectProperty && ast2.key.__i18n_replace_info__)
					{
						var astIndex = ret ? ret.indexOf(ast2.key) : -1;

						// 需要从结果中删除key的ast，如果没有在ret中找到ast
						// 那么不执行忽略
						if (astIndex != -1 && self.options.isIgnoreScanWarn)
						{
							ret.splice(astIndex, 1);
							delete ast2.key.__i18n_replace_info__;
							astUtils.setAstFlag(ast2.key, AST_FLAGS.DIS_REPLACE);

							debug('Ignore not replace property key error.%s', astUtils.getAstLocStr(ast));
						}
						else
						{

							throw new Error("[I18N] Object property can't use i18n."+astUtils.getAstLocStr(ast));
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
				result2 = self.scan(scope, item, ast, ast_key);
			}

			if (result2 && result2.length)
			{
				ArrayPush.apply(result, result2);

				// 不替换成函数
				if (blockModifier == BLOCK_MODIFIER.SKIP_REPLACE
					|| blockModifier == BLOCK_MODIFIER.SKIP_REPLACE+'@'+self.options.handlerName)
				{
					result2.forEach(function(item)
					{
						astUtils.setAstFlag(item, AST_FLAGS.SKIP_REPLACE);
						debug('skip replace %s', astUtils.getAstLocStr(item));
					});
				}
			}
		});

		if (result.length) return result;
	},

	_dealLiteral: function(ast)
	{
		var self = this;
		var value = ast.value;
		// case 有可能不是string
		if (!value || typeof value != 'string') return;

		// 正则说明
		// 必须要有非accii之外的字符（比如：中文）
		// 同时包含非html标签的其他字符
		var lineStrings = [];
		var cutWordReg = self.options.cutWordReg;

		if (cutWordReg)
		{
			var splitTranslateWordArr = value.split(cutWordReg);
			if (splitTranslateWordArr.length > 1)
			{
				// 必然比splitTranslateWordArr少一个
				value.match(cutWordReg).forEach(function(val, index)
				{
					lineStrings.push(
						{translateWord: false, value: splitTranslateWordArr[index]},
						{translateWord: true, value: val}
					);
				});

				lineStrings.push({translateWord: false, value: splitTranslateWordArr.pop()});
			}
		}

		var emitData =
		{
			value				: value,
			options				: self.options,
			originalLineStrings	: lineStrings,
			lineStrings			: lineStrings,
		};
		emitter.emit('cutword', emitData);

		lineStrings = emitData.lineStrings;
		if (!lineStrings || !lineStrings.length) return;


		// 整理最后的结果，进行输出
		var retArr;
		var comboAsts = ast.__i18n_combo_asts__;

		if (comboAsts)
		{
			// 如果之前有进行combo操作，那么对ast进行尝试还原
			retArr = astComboLiteral.revert(lineStrings, comboAsts, self.options);
		}

		if (!retArr)
		{
			retArr =
				[{
					ast			: ast,
					lineStrings	: lineStrings,
				}];
		}

		return retArr.map(function(item)
			{
				var ast = item.ast;
				var newAst = astUtils.asts2plusExpression(self._txts2asts(item.lineStrings));

				if (!newAst) return;

				var translateWords = [];
				item.lineStrings.forEach(function(item)
				{
					if (item.translateWord) translateWords.push(item.value);
				});

				ast.__i18n_replace_info__ =
				{
					newAst			: newAst,
					translateWords	: translateWords
				};

				return ast;
			})
			.filter(function(item)
			{
				return item;
			});
	},

	_comboLiteral: function(ast)
	{
		var self = this;
		if (self.options.comboLiteralMode == 'NONE'
			|| astUtils.checkAstFlag(ast, AST_FLAGS.SELF_CREATED))
		{
			return;
		}

		return astComboLiteral.combo(ast, self.options);
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
});

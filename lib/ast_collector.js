var _				= require('lodash');
var debug			= require('debug')('i18nc:ast_collector');
var astUtils		= require('./ast_utils');
var astTpl			= require('./ast_tpl');
var optionsUtils	= require('./options');
var ArrayPush		= Array.prototype.push;

var BLOCK_MODIFIER	= optionsUtils.BLOCK_MODIFIER;
var AST_FLAGS		= astUtils.AST_FLAGS;


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

	warpTxt2caller: function(txt)
	{
		return astTpl.CallExpression(this.options.handlerName, [astTpl.Literal(txt)]);
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
		result.push(isFirstTranslateWord ? this.warpTxt2caller(firstValue) : astTpl.Literal(firstValue));
		if (!nextValue) return result;

		result.push(isFirstTranslateWord ? astTpl.Literal(nextValue) : this.warpTxt2caller(nextValue));

		var children = endIndex != -1 && this.txtarr(arr.slice(endIndex));
		if (children) result = result.concat(children);

		return result;
	},


	scan: function(scope, ast, parent, itemName)
	{
		var self = this;

		if (!ast || astUtils.checkAstFlag(ast, AST_FLAGS.SELF_CREATED))
		{
			return;
		}

		switch(ast.type)
		{
			case 'FunctionDeclaration':
				// 定义I18N
				var handerName = ast.id && ast.id.name;
				if (handerName == self.options.handlerName)
				{
					scope.i18nHanlderAsts.push(ast);
				}
				else if (handerName && self.options.ignoreScanFunctionNames.indexOf(handerName) != -1)
				{
					debug('ignore scan function body %s.%s', handerName, astUtils.getAstLocStr(ast));
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
				var ret = self.dealLiteral(ast, parent, itemName);
				return ret && [ret];
				break;
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
				if (blockModifier == BLOCK_MODIFIER.SKIP_REPLACE)
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

		var result = astUtils.asts2plusExpression(this.txtarr(dealArr));
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
});



function ASTFunctionScope(ast, type)
{
	this.ast	= ast;
	// type		:
	// define factory
	this.type	= type;

	this.i18nArgs			= [];
	this.i18nHanlderAsts	= [];
	this.translateWordAsts	= [];

	this.subScopes	= [];
}

_.extend(ASTFunctionScope.prototype,
{
	/**
	 * 使用options，每次修改值，都要重新拷贝一份，很麻烦
	 */
	squeeze: function(isKeepDefineFactoryScope)
	{
		var self = this;

		if (!self.subScopes.length) return self;
		if (self.i18nHanlderAsts.length) isKeepDefineFactoryScope = false;

		var newScope = new ASTFunctionScope(self.ast, self.type);
		newScope.merge(this);

		self.subScopes.forEach(function(scope)
		{
			var scope2 = scope.squeeze(isKeepDefineFactoryScope);

			if (scope2.i18nHanlderAsts.length)
			{
				newScope.subScopes.push(scope2);
			}
			// 先判断自己有没有i18n函数，如果已经有了
			// 就可以忽略define
			else if (isKeepDefineFactoryScope && scope2.type == 'define factory')
			{
				newScope.subScopes.push(scope2);
			}
			// 合并数据
			else
			{
				newScope.merge(scope2);

				if (scope2.subScopes.length)
				{
					ArrayPush.apply(newScope.subScopes, scope2.subScopes);
				}
			}
		});

		return newScope;
	},

	merge: function(scope)
	{
		// 不合并subScopes
		// subScopes会在后续进行判断之后看需要进行合并
		ArrayPush.apply(this.i18nArgs, scope.i18nArgs);
		ArrayPush.apply(this.i18nHanlderAsts, scope.i18nHanlderAsts);
		ArrayPush.apply(this.translateWordAsts, scope.translateWordAsts);
	}
});

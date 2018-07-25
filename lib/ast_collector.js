'use strict';

var _					= require('lodash');
var debug				= require('debug')('i18nc-core:ast_collector');
var estraverse			= require('estraverse');
var emitter				= require('./emitter');
var astUtils			= require('./ast_utils');
var DEF					= require('./def');
var ASTScope			= require('./ast_scope').ASTScope;
var LiteralHandler		= require('./ast_literal_handler').LiteralHandler;
var ArrayPush			= Array.prototype.push;

var VISITOR_KEYS		= estraverse.VisitorKeys;
var BLOCK_MODIFIER		= DEF.BLOCK_MODIFIER;
var AST_FLAGS			= astUtils.AST_FLAGS;
var UNSUPPORT_AST_TYPS	= DEF.UNSUPPORT_AST_TYPS;

exports.ASTCollector	= ASTCollector;


function ASTCollector(options)
{
	this.options = options;
	this.literalHandler = new LiteralHandler(options);
}

_.extend(ASTCollector.prototype,
{
	collect: function(ast, scopeType)
	{
		var scope = new ASTScope(ast, scopeType);
		scope.translateWordAsts = this.scan(scope, ast) || [];
		return scope;
	},

	_parseI18NArgs: function(calleeAst)
	{
		var args = calleeAst.arguments;
		var result =
		{
			calleeAst: calleeAst,
			translateWordAst: args[0]
		};

		if (args.length > 1)
		{
			if (args[1].type == 'ArrayExpression')
			{
				result.formatArgAsts = args[1];
				if (args[2]) result.subtypeAst = args[2];
			}
			else
			{
				result.subtypeAst = args[1];
			}
		}

		return result;
	},


	scan: function(scope, ast)
	{
		var self = this;

		if (Array.isArray(ast))
		{
			var result = [];
			ast.forEach(function(item)
			{
				var result2 = self.scan(scope, item);
				if (result2 && result2.length) ArrayPush.apply(result, result2);
			});

			return result;
		}

		var emitData =
		{
			// 可以改写ast，后续处理以此为准
			// 注意：改写的时候，要extend一下，避免修改原始数据
			result		: ast,
			options		: self.options,
			original	: ast,
		};

		emitter.trigger('beforeScan', emitData);

		if (ast !== emitData.result)
		{
			debug('ast is modified before scan, old:%o, new:%o', ast, emitData.result);
			ast = emitData.result;
		}

		if (!ast || astUtils.checkAstFlag(ast, AST_FLAGS.BLOCK_MODIFIER))
		{
			return;
		}

		switch(ast.type)
		{
			case 'FunctionExpression':
			case 'FunctionDeclaration':
			case 'ArrowFunctionExpression':
				// 定义I18N
				var handlerName = ast.id && ast.id.name;
				if (handlerName)
				{
					if (handlerName == self.options.I18NHandlerName)
					{
						scope.I18NHandlerAsts.push(ast);
						return;
					}
					else if (self.options.ignoreScanHandlerNames[handlerName])
					{
						debug('ignore scan function body %s.%s', handlerName, astUtils.getAstLocStr(ast));
						return;
					}
					else if (self.options.I18NHandlerAlias
						&& self.options.I18NHandlerAlias.indexOf(handlerName) != -1)
					{
						astUtils.setAstFlag(ast, AST_FLAGS.I18N_ALIAS);
						scope.I18NHandlerAsts.push(ast);
						return;
					}
				}

				scope.subScopes.push(self.collect(ast.body, 'closure'));
				return;

			case 'CallExpression':
				if (!ast.callee) break;

				var calleeName;
				if (ast.callee.type == 'Identifier')
				{
					calleeName = ast.callee.name;

					switch(calleeName)
					{
						// 如果发现define函数，就留心一下，可能要插入I18N函数
						// 注意：
						// 只处理直接在define里面插入function的情况
						// 如果是通过变量方式代入funtion，就忽略
						case 'define':
							var defineLastArg = ast.arguments[ast.arguments.length-1];
							if (defineLastArg.type == 'FunctionExpression')
							{
								scope.subScopes.push(self.collect(defineLastArg.body, 'define factory'));
								return;
							}
							break;

						case self.options.I18NHandlerName:
							var I18NArgReulst = self._parseI18NArgs(ast);
							if (I18NArgReulst.formatArgAsts)
							{
								self.scan(scope, I18NArgReulst.formatArgAsts);
							}
							scope.I18NArgs.push(I18NArgReulst);
							return;
					}
				}

				if (!calleeName)
				{
					switch(ast.callee.type)
					{
						case 'MemberExpression':
							calleeName = astUtils.astMemberExpression2arr(ast.callee).join('.');
							break;

						case 'FunctionExpression':
							calleeName = ast.callee.id && ast.callee.id.name;
							break;
					}
				}

				if (!calleeName) break;

				if (self.options.ignoreScanHandlerNames[calleeName])
				{
					debug('ignore scan function args %s.%s', calleeName, astUtils.getAstLocStr(ast));
					return;
				}
				else if (ast.callee.type != 'FunctionExpression'
					&& self.options.I18NHandlerAlias
					&& self.options.I18NHandlerAlias.indexOf(calleeName) != -1)
				{
					astUtils.setAstFlag(ast, AST_FLAGS.I18N_ALIAS);

					var I18NArgReulst = self._parseI18NArgs(ast);
					if (I18NArgReulst.formatArgAsts)
					{
						self.scan(scope, I18NArgReulst.formatArgAsts);
					}
					scope.I18NArgs.push(I18NArgReulst);
					return;
				}

				break;

			case 'Literal':
				var ret = self.literalHandler.handle(ast);
				debug('deal literal, ast val:%s ret:%o', ast.value, ret);
				return ret;

			case 'ObjectExpression':
				var result = [];
				ast.properties.forEach(function(item)
				{
					var ret = self.scan(scope, item.key);
					if (ret && ret.length)
					{
						ret.forEach(function(keyAst)
						{
							astUtils.setAstFlag(keyAst, AST_FLAGS.DIS_REPLACE | AST_FLAGS.OBJECT_KEY);
							debug('Ignore not replace property key error.%s', astUtils.getAstLocStr(keyAst));
						});

						ArrayPush.apply(result, ret);
					}

					var ret = self.scan(scope, item.value);
					if (ret && ret.length) ArrayPush.apply(result, ret);
				});

				return result;

			// @todo 归类到脏数据中
			// var dd = `before ${xxd} middle ${I11(xxx)} after`
			// function dd() {return <div>xxxdd {this.xxx} {xxx(fff)} </div>}
			case 'TemplateLiteral':
			case 'JSXElement':
			case 'TaggedTemplateExpression':
				var result = self.scan(scope, ast);

				if (result)
				{
					var flag = UNSUPPORT_AST_TYPS[ast.type] | AST_FLAGS.DIS_REPLACE;
					result.forEach(function(item)
					{
						astUtils.setAstFlag(item, flag);
					});
				}

				return result;
		}


		var blockModifier = self._getBlockModifier(ast);
		if (self._isBlockModifier(blockModifier, BLOCK_MODIFIER.SKIP_SACN))
		{
			astUtils.setAstFlag(ast, AST_FLAGS.SKIP_SACN);
			astUtils.setAstFlag(ast.body[0], AST_FLAGS.BLOCK_MODIFIER);
			debug('skip scan, body len:%s', ast.body.length);
			return;
		}


		var scanKeys = VISITOR_KEYS[ast.type];
		if (!scanKeys)
		{
			debug('undefined ast type:%s', ast.type);
			scanKeys = _.keys(ast);
		}
		if (!scanKeys.length) return;

		var result = [];
		scanKeys.forEach(function(ast_key)
		{
			var result2 = self.scan(scope, ast[ast_key]);
			if (result2 && result2.length) ArrayPush.apply(result, result2);
		});

		if (result.length)
		{
			// 不替换成函数
			if (self._isBlockModifier(blockModifier, BLOCK_MODIFIER.SKIP_REPLACE))
			{
				result.forEach(function(item)
				{
					astUtils.setAstFlag(item, AST_FLAGS.SKIP_REPLACE);
					debug('skip replace %s', astUtils.getAstLocStr(item));
				});
			}

			return result;
		}
	},

	// 获取块的描述符
	// 必须是{}之间的第一行
	_getBlockModifier: function(ast)
	{
		if ((ast.type != 'BlockStatement' && ast.type != 'Program') || !ast.body) return;

		var astBodyFirst = ast.body[0];

		var val = astBodyFirst
			&& astBodyFirst.type == 'ExpressionStatement'
			&& astBodyFirst.expression
			&& astBodyFirst.expression.type == 'Literal'
			&& astBodyFirst.expression.value;

		if (val) return {ast: astBodyFirst, value: val};
	},

	_isBlockModifier: function(blockModifier, flag)
	{
		var val = blockModifier && blockModifier.value
		if (val == flag || val == flag+'@'+this.options.I18NHandlerName)
		{
			astUtils.setAstFlag(blockModifier.ast, AST_FLAGS.BLOCK_MODIFIER);
			return true;
		}

		return false;
	}
});

'use strict';

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:ast_scope');
var escodegen		= require('escodegen');
var astUtils		= require('./ast_utils');
var astTpl			= require('./ast_tpl');
var optionsUtils	= require('./options');
var I18NPlaceholder	= require('./i18n_placeholder').I18NPlaceholder;
var ArrayPush		= Array.prototype.push;
var AST_FLAGS		= astUtils.AST_FLAGS;

var ResultObject		= require('./result_object');
var DirtyWords			= ResultObject.DirtyWords;
var CodeTranslateWords	= ResultObject.CodeTranslateWords;
var FuncTranslateWords	= ResultObject.FuncTranslateWords;
var UsedTranslateWords	= ResultObject.UsedTranslateWords;
var TranslateWords		= ResultObject.TranslateWords;
var CodeInfoResult		= ResultObject.CodeInfoResult

exports.ASTScope = ASTScope;

function ASTScope(ast, type)
{
	this.ast	= ast;
	// type:
	// define factory
	// top
	this.type	= type;

	this.I18NArgs			= [];
	this.I18NHandlerAsts	= [];
	this.translateWordAsts	= [];

	this.subScopes	= [];
}

_.extend(ASTScope.prototype,
{
	/**
	 * 将subScope进行压缩
	 * 由于采集的时候，只要遇到函数定义，就会生成一个新的scope
	 * 而且实际使用的时候，是已I18N函数定义为准
	 * 所以提供一个压缩方法，将多余的subScope进行合并
	 *
	 * 除了保留I18N的作用范围的subScope，还需要处理define函数
	 *
	 * 注意：
	 * 1. 参数不使用options，因为每次修改值，都要重新拷贝一份，很麻烦
	 * 2. 合并仅仅将删除的subScope的采集内容合并到父scope，不会合并非自己的采集内容
	 */
	squeeze: function(isKeepDefineFactoryScope, options)
	{
		var self = this;

		if (!self.subScopes.length) return self;
		// 如果已经定义了I18N函数，则不进行define的闭包
		if (self.I18NHandlerAsts.length) isKeepDefineFactoryScope = false;
		// 只保留一层define，嵌套的不处理
		if (self.type == 'define factory') isKeepDefineFactoryScope = false;

		var newScope = new ASTScope(self.ast, self.type);
		newScope._merge(this);

		self.subScopes.forEach(function(scope)
		{
			var scope2 = scope.squeeze(isKeepDefineFactoryScope, options);

			// 已经有I18N函数
			if (scope2.I18NHandlerAsts.length
				// 对define函数调用进行特殊处理
				|| (isKeepDefineFactoryScope && scope2.type == 'define factory')
				// 如果是顶层，又希望闭包的时候，把I18N函数插入到第二层
				|| (self.type == 'top' && options.I18NHandler.insert.checkClosure))
			{
				newScope.subScopes.push(scope2);
			}
			// 合并数据
			else
			{
				newScope._merge(scope2);

				if (scope2.subScopes.length)
				{
					ArrayPush.apply(newScope.subScopes, scope2.subScopes);
				}
			}
		});

		return newScope;
	},

	_merge: function(scope)
	{
		// 不合并subScopes
		// subScopes会在后续进行判断之后看需要进行合并
		ArrayPush.apply(this.I18NArgs, scope.I18NArgs);
		ArrayPush.apply(this.I18NHandlerAsts, scope.I18NHandlerAsts);
		ArrayPush.apply(this.translateWordAsts, scope.translateWordAsts);
	},

	/**
	 * 获取自身除I18N函数之外的translateInfo
	 */
	codeTranslateWordInfoOfSelf: function()
	{
		var scope				= this;
		var dirtyWords			= new DirtyWords();
		var codeTranslateWords	= new CodeTranslateWords();

		scope.translateWordAsts.forEach(function(ast)
		{
			if (astUtils.checkAstFlag(ast, AST_FLAGS.DIS_REPLACE))
			{
				if (astUtils.checkAstFlag(ast, AST_FLAGS.OBJECT_KEY))
					dirtyWords.add(ast, "Object prototype can't use I18N");
				else
					dirtyWords.add(ast, "This ast can't use I18N");
			}
			else
			{
				codeTranslateWords.pushNewWord(ast);
			}
		});

		scope.I18NArgs.filter(function(argsInfo)
			{
				return argsInfo && argsInfo.translateWordAst;
			})
			.forEach(function(argsInfo)
			{
				var translateWordAst = argsInfo.translateWordAst;
				var subtypeAst = argsInfo.subtypeAst;

				if (!translateWordAst || !translateWordAst.value) return;
				if (translateWordAst.type != 'Literal')
				{
					dirtyWords.add(translateWordAst, 'I18N args[0] is not literal');
					return;
				}

				// 需要提取后面两个参数数据
				var value = (''+translateWordAst.value).trim();
				if (!value)
				{
					debug('blank i18n args:%s', translateWordAst.value);
					return;
				}

				var subtype = subtypeAst && astUtils.ast2constVal(subtypeAst);


				if (subtype)
				{
					codeTranslateWords.pushSubtype(subtype, translateWordAst);
				}
				else
				{
					codeTranslateWords.pushWraped(translateWordAst);
				}
			});

		// 这里的数据，均不包含子域
		return {
			// 脏数据
			dirtyWords			: dirtyWords,
			// 从代码中获取到的关键
			codeTranslateWords	: codeTranslateWords,
		};
	},

	// 处理code的核心代码
	codeAndInfo: function(tmpCode, originalCode, options)
	{
		var scope			= this;
		var codeFixOffset	= scope.ast.range[0];
		var codeStartPos	= 0;
		var dealAst			= [];
		var newCode			= [];
		var selfTWords		= scope.codeTranslateWordInfoOfSelf();

		var codeTranslateWordsJSON = selfTWords.codeTranslateWords.toJSON();
		var selfFuncTranslateWords = new FuncTranslateWords();
		var originalFileKeys = [];

		var IGNORE_translateWord		= !options.codeModifiedArea.TranslateWord;
		var IGNORE_regexp				= !options.codeModifiedArea.TranslateWord_RegExp;
		var IGNORE_I18NHandler_alias	= !options.codeModifiedArea.I18NHandlerAlias;

		// 预处理 I18N函数 begin
		var I18NHandlerAsts = scope.I18NHandlerAsts.sort(function(a, b)
			{
				return a.range[0] > b.range[0] ? 1 : -1;
			});
		var lastI18NHandlerAst, lastI18NHandlerAliasAsts = {};
		for(var i = I18NHandlerAsts.length; i--;)
		{
			var item = I18NHandlerAsts[i];
			if (astUtils.checkAstFlag(item, AST_FLAGS.I18N_ALIAS))
			{
				var handlerName = item.id && item.id.name;
				if (!lastI18NHandlerAliasAsts[handlerName])
				{
					lastI18NHandlerAliasAsts[handlerName] = item;
				}
			}
			else
			{
				if (!lastI18NHandlerAst) lastI18NHandlerAst = item;
			}
		}

		I18NHandlerAsts.forEach(function(ast)
		{
			dealAst.push({type: 'I18NHandler', value: ast});
		});
		// 预处理 I18N函数 end


		if (!IGNORE_I18NHandler_alias)
		{
			scope.I18NArgs.forEach(function(item)
			{
				if (astUtils.checkAstFlag(item.calleeAst, AST_FLAGS.I18N_ALIAS))
				{
					dealAst.push({type: 'I18NAliasCallee', value: item.calleeAst});
				}
			});
		}

		scope.subScopes.forEach(function(item)
		{
			dealAst.push({type: 'scope', value: item.ast, scope: item});
		});

		scope.translateWordAsts.forEach(function(ast)
		{
			if (!astUtils.checkAstFlag(ast, AST_FLAGS.SKIP_REPLACE | AST_FLAGS.DIS_REPLACE))
			{
				dealAst.push({type: 'translateWord', value: ast});
			}
		});


		// 插入一个默认的翻译函数
		var I18NPlaceholderNew = new I18NPlaceholder(codeTranslateWordsJSON, originalCode, options);
		if (scope.ast.type == 'BlockStatement')
		{
			codeStartPos++;

			// 如果是在结构体内，那么至少要缩进一个tab
			var _originalI18nPlaceholderNewToString = I18NPlaceholderNew.toString;
			I18NPlaceholderNew.toString = function()
			{
				var str = _originalI18nPlaceholderNewToString.apply(this, arguments);
				if (!str) return str;

				var codeIndent = astUtils.codeIndent(scope.ast, originalCode)+'\t';

				return str.split('\n')
					.map(function(val)
					{
						return val.trim() ? codeIndent+val : val;
					})
					.join('\n');
			};
		}
		newCode.push(tmpCode.slice(0, codeStartPos), I18NPlaceholderNew);
		tmpCode = tmpCode.slice(codeStartPos);
		codeFixOffset += codeStartPos;


		// 逐个处理需要替换的数据
		var I18NPlaceholders = [];
		var subScopeDatas = [];
		dealAst.sort(function(a, b)
			{
				return a.value.range[0] > b.value.range[0] ? 1 : -1;
			})
			.forEach(function(item)
			{
				var ast = item.value;
				var codeStartPos = ast.range[0] - codeFixOffset;
				var codeEndPos = ast.range[1] - codeFixOffset;

				newCode.push(tmpCode.slice(0, codeStartPos));

				switch(item.type)
				{
					case 'I18NAliasCallee':
						var myAst = astTpl.CallExpression(options.I18NHandlerName, ast.arguments);
						var myCode = escodegen.generate(myAst, optionsUtils.escodegenOptions);
						newCode.push(myCode);
						break;

					case 'I18NHandler':
						var myI18NPlaceholder = new I18NPlaceholder(
								codeTranslateWordsJSON,
								originalCode,
								options,
								ast
							);

						var handlerName = ast.id && ast.id.name;
						if (ast !== lastI18NHandlerAst
							&& ast !== lastI18NHandlerAliasAsts[handlerName])
						{
							// 函数保留，但翻译数据全部不要
							// 翻译数据，全部以pow文件或者最后的函数为准
							myI18NPlaceholder.renderType = 'simple';
						}
						I18NPlaceholders.push(myI18NPlaceholder);

						if (!IGNORE_I18NHandler_alias)
						{
							myI18NPlaceholder.handlerName = options.I18NHandlerName;
						}

						newCode.push(myI18NPlaceholder);
						break;

					case 'translateWord':
						if (IGNORE_translateWord ||
							(IGNORE_regexp && ast.value instanceof RegExp))
						{
							newCode.push(tmpCode.slice(codeStartPos, codeEndPos));
						}
						else
						{
							var myCode = escodegen.generate(ast.__i18n_replace_info__.newAst, optionsUtils.escodegenOptions);
							newCode.push(myCode);
						}
						break;


					case 'scope':
						var scopeData = item.scope.codeAndInfo(tmpCode.slice(codeStartPos, codeEndPos), originalCode, options);
						newCode.push(scopeData.code);
						subScopeDatas.push(scopeData);
						break;

					default:
						debug('undefind type:%s ast:%o', item.type, ast);
						newCode.push(tmpCode.slice(codeStartPos, codeEndPos));
				}

				tmpCode = tmpCode.slice(codeEndPos);
				codeFixOffset += codeEndPos;
			});

		// 如果作用域中，已经有I18N函数
		// 那么头部插入的函数就不需要了
		if ((!IGNORE_I18NHandler_alias && I18NPlaceholders.length)
			|| (IGNORE_I18NHandler_alias && lastI18NHandlerAst))
		{
			debug('ignore insert new I18NHandler');
			I18NPlaceholderNew.renderType = 'empty';
		}

		// 输出最终代码
		var resultCode = newCode.join('')+tmpCode;

		if (I18NPlaceholderNew.getRenderType() == 'complete'
			&& options.I18NHandler.insert.checkClosure
			&& scope.type == 'top')
		{
			throw new Error('closure youself');
		}

		// 进行最后的附加数据整理、合并
		I18NPlaceholders.forEach(function(I18NPlaceholder)
		{
			var info = I18NPlaceholder.parse();
			var FILE_KEY = info.__FILE_KEY__;
			originalFileKeys.push(FILE_KEY);

			selfFuncTranslateWords.add(FILE_KEY, info.__TRANSLATE_JSON__);
		});

		var currentI18NHandler = I18NPlaceholders[I18NPlaceholders.length - 1] || I18NPlaceholderNew;
		var usedTranslateWords = new UsedTranslateWords();
		usedTranslateWords.add(currentI18NHandler.parse().__FILE_KEY__, currentI18NHandler.getTranslateJSON());
		var selfScopeData = new CodeInfoResult(
		{
			code             : resultCode,
			currentFileKey   : currentI18NHandler.parse().__FILE_KEY__,
			originalFileKeys : originalFileKeys,
			subScopeDatas    : subScopeDatas,
			// 脏数据
			dirtyWords       : selfTWords.dirtyWords,
			words            : new TranslateWords(selfTWords.codeTranslateWords, selfFuncTranslateWords, usedTranslateWords),
		});

		// 返回数据，不包含子域数据
		return selfScopeData;
	}
});

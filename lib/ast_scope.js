'use strict';

var _					= require('lodash');
var debug				= require('debug')('i18nc-core:ast_scope');
var i18ncAst			= require('i18nc-ast');
var astTpl				= i18ncAst.tpl;
var astUtil				= i18ncAst.util;
var DEF					= require('./def');
var I18NPlaceholder		= require('./i18n_placeholder').I18NPlaceholder;
var ArrayPush			= Array.prototype.push;
var AST_FLAGS			= i18ncAst.AST_FLAGS;
var UNSUPPORT_AST_TYPS	= DEF.UNSUPPORT_AST_TYPS;

var ResultObject		= require('./result_object');
var DirtyWords			= ResultObject.DirtyWords;
var CodeTranslateWords	= ResultObject.CodeTranslateWords;
var FuncTranslateWords	= ResultObject.FuncTranslateWords;
var UsedTranslateWords	= ResultObject.UsedTranslateWords;
var TranslateWords		= ResultObject.TranslateWords;
var CodeInfoResult		= ResultObject.CodeInfoResult;

var I18NC;
function runNewI18NC(code, ast, options, originalCode, isInsertHandler)
{
	// 存在循环应用，所以在调用的时候，再require
	if (!I18NC) I18NC = require('./main');
	options.I18NHandler.insert.enable = false;
	var codeIndent = astUtil.codeIndent(ast, originalCode);
	var newCode = I18NC.run(code, options).code;
	newCode = newCode.split('\n').join('\n'+codeIndent);
	options.I18NHandler.insert.enable = isInsertHandler;

	return newCode;
}

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
	codeTranslateWordInfoOfSelf: function(options)
	{
		var scope				= this;
		var dirtyWords			= new DirtyWords();
		var codeTranslateWords	= new CodeTranslateWords();

		var IGNORE_translateWord	= !options.codeModifyItems.TranslateWord;
		var IGNORE_regexp			= !options.codeModifyItems.TranslateWord_RegExp;

		scope.translateWordAsts.forEach(function(ast)
		{
			if (astUtil.checkAstFlag(ast, AST_FLAGS.DIS_REPLACE))
			{
				var ret = _.some(UNSUPPORT_AST_TYPS, function(flag, name)
				{
					if (astUtil.checkAstFlag(ast, flag))
					{
						dirtyWords.add(ast, 'Not Support Ast `'+name+'` yet');
						return true;
					}
				});

				if (!ret) dirtyWords.add(ast, "This ast can't use I18N");
			}
			else if (IGNORE_translateWord ||
				(IGNORE_regexp && ast.value instanceof RegExp))
			{
				dirtyWords.add(ast, 'Text Replacer Not Enabled');
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

				var subtype = subtypeAst && astUtil.ast2constVal(subtypeAst);


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
		var newCodes		= [];
		var selfTWords		= scope.codeTranslateWordInfoOfSelf(options);
		var isInsertHandler	= options.I18NHandler.insert.enable;

		var codeTranslateWordsJSON = selfTWords.codeTranslateWords.toJSON();
		var selfFuncTranslateWords = new FuncTranslateWords();
		var originalFileKeys = [];

		var IGNORE_I18NHandler_alias	= !options.codeModifyItems.I18NHandlerAlias;

		// 预处理 I18N函数 begin
		var I18NHandlerAsts = scope.I18NHandlerAsts.sort(function(a, b)
			{
				return a.range[0] > b.range[0] ? 1 : -1;
			});
		var lastI18NHandlerAst, lastI18NHandlerAliasAsts = {};
		for(var i = I18NHandlerAsts.length; i--;)
		{
			var item = I18NHandlerAsts[i];
			if (astUtil.checkAstFlag(item, AST_FLAGS.I18N_ALIAS))
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
				if (astUtil.checkAstFlag(item.calleeAst, AST_FLAGS.I18N_ALIAS))
				{
					dealAst.push({type: 'I18NAliasCallee', value: item.calleeAst});
				}
			});
		}

		scope.subScopes.forEach(function(item)
		{
			dealAst.push({type: 'scope', value: item.ast, scope: item});
		});

		selfTWords.codeTranslateWords.list.forEach(function(item)
		{
			if (item.type == 'new'
				&& !astUtil.checkAstFlag(item.originalAst, AST_FLAGS.SKIP_REPLACE | AST_FLAGS.DIS_REPLACE))
			{
				dealAst.push({type: 'translateWord', value: item.originalAst});
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

				var codeIndent = astUtil.codeIndent(scope.ast, originalCode)+'\t';

				return str.split('\n')
					.map(function(val)
					{
						return val.trim() ? codeIndent+val : val;
					})
					.join('\n');
			};
		}
		newCodes.push(tmpCode.slice(0, codeStartPos), I18NPlaceholderNew);
		tmpCode = tmpCode.slice(codeStartPos);
		codeFixOffset += codeStartPos;

		dealAst = dealAst.sort(function(a, b)
		{
			return a.value.range[0] > b.value.range[0] ? 1 : -1;
		});

		if (dealAst.length > 1)
		{
			dealAst.reduce(function(a, b)
			{
				// 整理包含关系
				if (a.value.range[1] > b.value.range[0])
				{
					a.include = true;
					b.included = true;
					return a;
				}

				return b;
			});
		}

		// 逐个处理需要替换的数据
		var I18NPlaceholders = [];
		var subScopeDatas = [];
		dealAst.forEach(function(item)
		{
			// 被包含的元素，不进行处理
			if (item.included) return;

			var ast = item.value;
			var codeStartPos = ast.range[0] - codeFixOffset;
			var codeEndPos = ast.range[1] - codeFixOffset;

			newCodes.push(tmpCode.slice(0, codeStartPos));
			var newCode;

			switch(item.type)
			{
				case 'I18NAliasCallee':
					var myAst = astTpl.CallExpression(options.I18NHandlerName, ast.arguments);
					newCode = astUtil.tocode(myAst);
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

					newCode = myI18NPlaceholder;
					break;

				case 'translateWord':
					newCode = astUtil.tocode(ast.__i18n_replace_info__.newAst);
					break;


				case 'scope':
					var scopeData = item.scope.codeAndInfo(tmpCode.slice(codeStartPos, codeEndPos), originalCode, options);
					newCode = scopeData.code;
					subScopeDatas.push(scopeData);
					break;

				default:
					debug('undefind type:%s ast:%o', item.type, ast);
					newCode = tmpCode.slice(codeStartPos, codeEndPos);
			}

			if (item.include && newCode != tmpCode.slice(codeStartPos, codeEndPos))
			{
				// 包含情况下，对结果再允许一次i18nc解析
				newCode = runNewI18NC(newCode, ast, options, originalCode, isInsertHandler);
			}

			newCodes.push(newCode);

			tmpCode = tmpCode.slice(codeEndPos);
			codeFixOffset += codeEndPos;
		});

		// 如果作用域中，已经有I18N函数
		// 那么头部插入的函数就不需要了
		if (!isInsertHandler
			|| (!IGNORE_I18NHandler_alias && I18NPlaceholders.length)
			|| (IGNORE_I18NHandler_alias && lastI18NHandlerAst))
		{
			debug('ignore insert new I18NHandler');
			I18NPlaceholderNew.renderType = 'empty';
		}

		// 输出最终代码
		var resultCode = newCodes.join('')+tmpCode;

		if (isInsertHandler
			&& options.I18NHandler.insert.checkClosure
			&& scope.type == 'top'
			&& I18NPlaceholderNew.getRenderType() == 'complete')
		{
			throw new Error('closure by youself');
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

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:ast_function_scope');
var extend			= require('extend');
var escodegen		= require('escodegen');
var astUtils		= require('./ast_utils');
var astTpl			= require('./ast_tpl');
var optionsUtils	= require('./options');
var I18NPlaceholder	= require('./i18n_placeholder').I18NPlaceholder;
var ArrayPush		= Array.prototype.push;
var AST_FLAGS		= astUtils.AST_FLAGS;


exports.ASTFunctionScope = ASTFunctionScope;

function ASTFunctionScope(ast, type)
{
	this.ast	= ast;
	// type		:
	// define factory
	this.type	= type;

	this.I18NArgs			= [];
	this.I18NHanlderAsts	= [];
	this.translateWordAsts	= [];

	this.subScopes	= [];
}

_.extend(ASTFunctionScope.prototype,
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
	squeeze: function(isKeepDefineFactoryScope)
	{
		var self = this;

		if (!self.subScopes.length) return self;
		if (self.I18NHanlderAsts.length) isKeepDefineFactoryScope = false;

		var newScope = new ASTFunctionScope(self.ast, self.type);
		newScope._merge(this);

		self.subScopes.forEach(function(scope)
		{
			var scope2 = scope.squeeze(isKeepDefineFactoryScope);

			if (scope2.I18NHanlderAsts.length)
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
		ArrayPush.apply(this.I18NHanlderAsts, scope.I18NHanlderAsts);
		ArrayPush.apply(this.translateWordAsts, scope.translateWordAsts);
	},

	/**
	 * 获取自身除I18N函数之外的translateInfo
	 */
	codeTranslateWordInfoOfSelf: function()
	{
		var scope		= this;
		var dirtyAsts	= [];

		var codeTranslateWords =
		{
			DEFAULTS		: [],
			SUBTYPES		: {},
		};
		var I18NArgsTranslateWords =
		{
			DEFAULTS		: [],
			SUBTYPES		: {},
		};

		scope.translateWordAsts.forEach(function(item)
		{
			codeTranslateWords.DEFAULTS = codeTranslateWords.DEFAULTS.concat(item.__i18n_replace_info__.translateWords);
		});

		scope.I18NArgs.filter(function(argsInfo)
			{
				return argsInfo && argsInfo.translateWordAst;
			})
			// 排序是为了line类型的subtype
			.sort(function(a, b)
			{
				return a.translateWordAst.range[0] > b.translateWordAst.range[0] ? 1 : -1;
			})
			.forEach(function(argsInfo)
			{
				var translateWordAst = argsInfo.translateWordAst;
				var subtypeAst = argsInfo.subtypeAst;

				if (!translateWordAst || !translateWordAst.value) return;
				if (translateWordAst.type != 'Literal')
				{
					dirtyAsts.push(
					{
						reason	: 'I18N args[0] is not literal',
						code	: escodegen.generate(translateWordAst, optionsUtils.escodegenOptions),
						ast		: translateWordAst
					});
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
					var arr = codeTranslateWords.SUBTYPES[subtype]
						|| (codeTranslateWords.SUBTYPES[subtype] = []);
					arr.push(value);

					var arr = I18NArgsTranslateWords.SUBTYPES[subtype]
						|| (I18NArgsTranslateWords.SUBTYPES[subtype] = []);
					arr.push(value);
				}
				else
				{
					codeTranslateWords.DEFAULTS.push(value);
					I18NArgsTranslateWords.DEFAULTS.push(value);
				}
			});

		// 这里的数据，均不包含子域
		return {
			// 脏数据
			dirtyAsts				: dirtyAsts,
			// 从代码中获取到的关键，包含I18NArgsTranslateWords
			codeTranslateWords		: codeTranslateWords,
			// 从i18n参数中提取的翻译数据
			I18NArgsTranslateWords	: I18NArgsTranslateWords,
		};
	},

	// 处理code的核心代码
	codeAndInfo: function(tmpCode, orignalCode, options)
	{
		var scope		= this;
		var fixOffset	= scope.ast.range[0];
		var dealAst		= [];
		var newCode		= [];
		var selfTWords	= scope.codeTranslateWordInfoOfSelf();

		var selfFuncTranslateWords = {};
		var orignalFileKeys = [];

		var IGNORE_I18NHandler		= options.codeModifiedArea.indexOf('I18NHandler') == -1;
		var IGNORE_translateWord	= options.codeModifiedArea.indexOf('translateWord') == -1;
		var UPDATE_I18NHANLERALIAS	= options.codeModifiedArea.indexOf('I18NHandlerAlias') != -1;

		// 预处理 I18N函数 begin
		var I18NHanlderAsts = scope.I18NHanlderAsts.sort(function(a, b)
			{
				return a.range[0] > b.range[0] ? 1 : -1;
			});
		var lastI18NHanlderAst, lastI18NHandlerAliasAsts = {};
		for(var i = I18NHanlderAsts.length; i--;)
		{
			var item = I18NHanlderAsts[i];
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
				if (!lastI18NHanlderAst) lastI18NHanlderAst = item;
			}
		}

		I18NHanlderAsts.forEach(function(item)
		{
			dealAst.push({type: 'I18NHandler', value: item});
		});
		// 预处理 I18N函数 end


		if (UPDATE_I18NHANLERALIAS)
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

		scope.translateWordAsts.forEach(function(item)
		{
			if (!astUtils.checkAstFlag(item, AST_FLAGS.SKIP_REPLACE))
			{
				dealAst.push({type: 'translateWord', value: item});
			}
		});


		// 插入一个默认的翻译函数
		var I18NPlaceholderNew = new I18NPlaceholder(selfTWords.codeTranslateWords, orignalCode, options);
		var startPos = 0;
		if (scope.ast.type == 'BlockStatement')
		{
			startPos++;

			// 如果是在结构体内，那么至少要缩进一个tab
			var _originalI18nPlaceholderNewToString = I18NPlaceholderNew.toString;
			I18NPlaceholderNew.toString = function()
			{
				var str = _originalI18nPlaceholderNewToString.apply(this, arguments);
				if (!str) return str;

				var codeIndent = astUtils.codeIndent(scope.ast, orignalCode)+'\t';

				return str.split('\n')
					.map(function(val)
					{
						return val.trim() ? codeIndent+val : val;
					})
					.join('\n');
			};
		}
		newCode.push(tmpCode.slice(0, startPos), I18NPlaceholderNew);
		tmpCode = tmpCode.slice(startPos);
		fixOffset += startPos;


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
				var startPos = ast.range[0] - fixOffset;
				var endPos = ast.range[1] - fixOffset;

				newCode.push(tmpCode.slice(0, startPos));

				switch(item.type)
				{
					case 'I18NAliasCallee':
						var myAst = astTpl.CallExpression(options.I18NHandlerName, ast.arguments);
						var myCode = escodegen.generate(myAst, optionsUtils.escodegenOptions);
						newCode.push(myCode);
						break;

					case 'I18NHandler':
						var myI18NPlaceholder = new I18NPlaceholder(
								selfTWords.codeTranslateWords,
								orignalCode,
								options,
								ast
							);

						var handlerName = ast.id && ast.id.name;
						if (ast !== lastI18NHanlderAst
							&& ast !== lastI18NHandlerAliasAsts[handlerName])
						{
							// 函数保留，但翻译数据全部不要
							// 翻译数据，全部以pow文件或者最后的函数为准
							myI18NPlaceholder.renderType = 'simple';
						}
						I18NPlaceholders.push(myI18NPlaceholder);

						if (UPDATE_I18NHANLERALIAS)
						{
							myI18NPlaceholder.handlerName = options.I18NHandlerName;
						}

						if (IGNORE_I18NHandler)
							newCode.push(tmpCode.slice(startPos, endPos));
						else
							newCode.push(myI18NPlaceholder);
						break;

					case 'translateWord':
						if (IGNORE_translateWord)
							newCode.push(tmpCode.slice(startPos, endPos));
						else
						{
							var myCode = escodegen.generate(ast.__i18n_replace_info__.newAst, optionsUtils.escodegenOptions);
							newCode.push(myCode);
						}
						break;


					case 'scope':
						var scopeData = item.scope.codeAndInfo(tmpCode.slice(startPos, endPos), orignalCode, options);
						newCode.push(scopeData.code);
						subScopeDatas.push(scopeData);
						break;

					default:
						debug('undefind type:%s ast:%o', item.type, ast);
						newCode.push(tmpCode.slice(startPos, endPos));
				}

				tmpCode = tmpCode.slice(endPos);
				fixOffset += endPos;
			});

		// 如果作用域中，已经有I18N函数
		// 那么头部插入的函数就不需要了
		if ((UPDATE_I18NHANLERALIAS && I18NPlaceholders.length)
			|| (!UPDATE_I18NHANLERALIAS && lastI18NHanlderAst))
		{
			I18NPlaceholderNew.renderType = 'empty';
		}

		// 输出最终代码
		var resultCode = newCode.join('')+tmpCode;

		if (I18NPlaceholderNew.getRenderType() == 'complete'
			&& options.isClosureWhenInsertedHead
			&& scope.type != 'define factory')
		{
			resultCode = ';(function(){\n'+resultCode+'\n})();'
		}

		// 进行最后的附加数据整理、合并
		I18NPlaceholders.forEach(function(I18NPlaceholder)
		{
			var info = I18NPlaceholder.parse();
			var FILE_KEY = info.__FILE_KEY__;
			orignalFileKeys.push(FILE_KEY);

			var arr = selfFuncTranslateWords[FILE_KEY] || (selfFuncTranslateWords[FILE_KEY] = []);
			arr.push(info.__TRANSLATE_JSON__);
		});

		var currentI18NHanlder = I18NPlaceholders[I18NPlaceholders.length - 1] || I18NPlaceholderNew;
		var selfScopeData =
		{
			code: resultCode,
			currentFileKey: currentI18NHanlder.parse().__FILE_KEY__,
			orignalFileKeys: orignalFileKeys,
			subScopeDatas: subScopeDatas,
			// 脏数据
			dirtyAsts: selfTWords.dirtyAsts,
			// 从代码中获取到的关键字，包含I18NArgsTranslateWords
			codeTranslateWords: selfTWords.codeTranslateWords,
			// 从i18n参数中提取的翻译数据
			I18NArgsTranslateWords: selfTWords.I18NArgsTranslateWords,
			// 从i18n函数中解出来的翻译数据 数据带filekey
			funcTranslateWords: selfFuncTranslateWords,
			// 处理后，正在使用的翻译数据  数据不带filekey
			usedTranslateWords: currentI18NHanlder.getTranslateJSON(),
		};

		// 返回数据，不包含子域数据
		return selfScopeData;
	}
});

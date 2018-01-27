var _				= require('lodash');
var debug			= require('debug')('i18nc-core:ast_function_scope');
var extend			= require('extend');
var escodegen		= require('escodegen');
var astUtils		= require('./ast_utils');
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

	this.i18nArgs			= [];
	this.i18nHanlderAsts	= [];
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
		if (self.i18nHanlderAsts.length) isKeepDefineFactoryScope = false;

		var newScope = new ASTFunctionScope(self.ast, self.type);
		newScope._merge(this);

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
		ArrayPush.apply(this.i18nArgs, scope.i18nArgs);
		ArrayPush.apply(this.i18nHanlderAsts, scope.i18nHanlderAsts);
		ArrayPush.apply(this.translateWordAsts, scope.translateWordAsts);
	},

	// 处理code的核心代码
	codeAndInfo: function(tmpCode, orignalCode, options)
	{
		var scope		= this;
		var fixOffset	= scope.ast.range[0];
		var newCode		= [];
		var dirtyAsts	= [];
		var dealAst		= [];

		var funcTranslateWords = {};
		var usedTranslateWords = {};
		var codeTranslateWords =
		{
			DEFAULTS		: [],
			SUBTYPES		: {},
			SUBTYPE_LINES	: [],
		};
		var i18nArgsTranslateWords =
		{
			DEFAULTS		: [],
			SUBTYPES		: {},
		};

		var IGNORE_i18nHandler = options.codeModifiedArea.indexOf('i18nHandler') == -1;
		var IGNORE_translateWord = options.codeModifiedArea.indexOf('translateWord') == -1;


		// 预处理 I18N函数 begin
		var i18nHanlderAsts = scope.i18nHanlderAsts.sort(function(a, b)
			{
				return a.range[0] > b.range[0] ? 1 : -1;
			});

		var lastI18NHanlderAst = i18nHanlderAsts[i18nHanlderAsts.length-1];

		i18nHanlderAsts.forEach(function(item)
		{
			dealAst.push({type: 'i18nHandler', value: item});
		});
		// 预处理 I18N函数 end

		scope.translateWordAsts.forEach(function(item)
		{
			codeTranslateWords.DEFAULTS = codeTranslateWords.DEFAULTS.concat(item.__i18n_replace_info__.translateWords);

			if (!astUtils.checkAstFlag(item, AST_FLAGS.SKIP_REPLACE))
			{
				dealAst.push({type: 'translateWord', value: item});
			}
		});

		scope.subScopes.forEach(function(item)
		{
			dealAst.push({type: 'scope', value: item.ast, scope: item});
		});


		scope.i18nArgs.filter(function(argsInfo)
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

					var arr = i18nArgsTranslateWords.SUBTYPES[subtype]
						|| (i18nArgsTranslateWords.SUBTYPES[subtype] = []);
					arr.push(value);
				}
				else
				{
					codeTranslateWords.DEFAULTS.push(value);
					i18nArgsTranslateWords.DEFAULTS.push(value);
				}
			});

		// 将当前作用范围内采集到的SUBTYPES的翻译，连成一句话
		_.each(codeTranslateWords.SUBTYPES, function(arr)
		{
			codeTranslateWords.SUBTYPE_LINES.push(arr.join('%s'));
		});


		// 插入一个默认的翻译函数
		var i18nPlaceholderNew = new I18NPlaceholder(codeTranslateWords, orignalCode, options);
		var startPos = 0;
		if (scope.ast.type == 'BlockStatement')
		{
			startPos++;

			// 如果是在结构体内，那么至少要缩进一个tab
			var _originalI18nPlaceholderNewToString = i18nPlaceholderNew.toString;
			i18nPlaceholderNew.toString = function()
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
		newCode.push(tmpCode.slice(0, startPos), i18nPlaceholderNew);
		tmpCode = tmpCode.slice(startPos);
		fixOffset += startPos;


		// 逐个处理需要替换的数据
		var i18nPlaceholders = [];
		var scopeDatas = [];
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
					case 'i18nHandler':
						var i18nPlaceholder = new I18NPlaceholder(
								codeTranslateWords,
								orignalCode,
								options,
								ast
							);

						if (ast !== lastI18NHanlderAst)
						{
							i18nPlaceholder.renderType = 'simple';
						}
						i18nPlaceholders.push(i18nPlaceholder);

						if (IGNORE_i18nHandler)
							newCode.push(tmpCode.slice(startPos, endPos));
						else
							newCode.push(i18nPlaceholder);
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
						scopeDatas.push(scopeData);
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
		if (i18nPlaceholders.length)
		{
			i18nPlaceholderNew.renderType = 'empty';
		}

		// 输出最终代码
		var resultCode = newCode.join('')+tmpCode;

		if (i18nPlaceholderNew.getRenderType() == 'complete'
			&& options.isClosureWhenInsertedHead
			&& scope.type != 'define factory')
		{
			resultCode = ';(function(){\n'+resultCode+'\n})();'
		}

		// 进行最后的附加数据整理、合并
		i18nPlaceholders.forEach(function(i18nPlaceholder)
		{
			var info = i18nPlaceholder.parse();
			var FILE_KEY = info.__FILE_KEY__;

			funcTranslateWords[FILE_KEY] = extend(true, {},
					funcTranslateWords[FILE_KEY],
					info.__TRANSLATE_JSON__
				);

			usedTranslateWords[FILE_KEY] = extend(true, {},
					usedTranslateWords[FILE_KEY],
					i18nPlaceholder.getTranslateJSON()
				);
		});

		_.each(scopeDatas, function(scopeData)
		{
			ArrayPush.apply(dirtyAsts, scopeData.dirtyAsts);

			funcTranslateWords = extend(true, funcTranslateWords, scopeData.funcTranslateWords);

			usedTranslateWords = extend(true, usedTranslateWords, scopeData.usedTranslateWords);

			ArrayPush.apply(codeTranslateWords.DEFAULTS, scopeData.codeTranslateWords.DEFAULTS);
			// 保留词频信息
			// codeTranslateWords.DEFAULTS = _.uniq(codeTranslateWords.DEFAULTS);
			ArrayPush.apply(codeTranslateWords.SUBTYPE_LINES, scopeData.codeTranslateWords.SUBTYPE_LINES);
			// 保留词频信息
			// codeTranslateWords.SUBTYPE_LINES = _.uniq(codeTranslateWords.SUBTYPE_LINES);
			_.each(scopeData.codeTranslateWords.SUBTYPES, function(list, subtype)
			{
				var arr = codeTranslateWords.SUBTYPES[subtype]
					|| (codeTranslateWords.SUBTYPES[subtype] = []);

				ArrayPush.apply(arr, list);
				// 保留词频信息
				// codeTranslateWords.SUBTYPES[subtype] = _.uniq(codeTranslateWords.SUBTYPES[subtype]);
			});


			ArrayPush.apply(i18nArgsTranslateWords.DEFAULTS, scopeData.i18nArgsTranslateWords.DEFAULTS);
			i18nArgsTranslateWords.DEFAULTS = _.uniq(i18nArgsTranslateWords.DEFAULTS);
			_.each(scopeData.i18nArgsTranslateWords.SUBTYPES, function(list, subtype)
			{
				var arr = i18nArgsTranslateWords.SUBTYPES[subtype]
					|| (i18nArgsTranslateWords.SUBTYPES[subtype] = []);

				ArrayPush.apply(arr, list);
				i18nArgsTranslateWords.SUBTYPES[subtype] = _.uniq(i18nArgsTranslateWords.SUBTYPES[subtype]);
			});
		});


		return {
			code					: resultCode,
			// 脏数据 (包含子作用域)
			dirtyAsts				: dirtyAsts,
			// 从代码中获取到的关键字 (包含子作用域)
			codeTranslateWords		: codeTranslateWords,
			// 从i18n参数中提取的翻译数据 (包含子作用域)
			i18nArgsTranslateWords	: i18nArgsTranslateWords,
			// 从i18n函数中解出来的翻译数据 (包含子作用域)
			funcTranslateWords		: funcTranslateWords,
			// 处理后，正在使用的翻译数据 (包含子作用域)
			usedTranslateWords		: usedTranslateWords,
		};
	}
});

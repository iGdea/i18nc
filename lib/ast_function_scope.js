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


		// 预处理 I18N函数 begin
		if (options.codeModifyRangs.indexOf('i18nHandler') != -1)
		{
			var i18nHanlderAsts = scope.i18nHanlderAsts.sort(function(a, b)
				{
					return a.range[0] > b.range[0] ? 1 : -1;
				});

			var lastI18NHanlderAst = i18nHanlderAsts[i18nHanlderAsts.length-1];
			if (lastI18NHanlderAst)
			{
				astUtils.setAstFlag(lastI18NHanlderAst, AST_FLAGS.VALID_I18N);
			}

			i18nHanlderAsts.forEach(function(item)
			{
				dealAst.push({type: 'i18nHandler', value: item});
			});
		}
		// 预处理 I18N函数 end

		if (options.codeModifyRangs.indexOf('translateWord') != -1)
		{
			scope.translateWordAsts.forEach(function(item)
			{
				codeTranslateWords.DEFAULTS = codeTranslateWords.DEFAULTS.concat(item.__i18n_replace_info__.translateWords);

				if (!astUtils.checkAstFlag(item, AST_FLAGS.SKIP_REPLACE))
				{
					dealAst.push({type: 'translateWord', value: item});
				}
			});
		}


		scope.subScopes.forEach(function(item)
		{
			dealAst.push({type: 'scope', value: item.ast, scope: item});
		});


		scope.i18nArgs.filter(function(args)
			{
				return args && args[0];
			})
			// 排序是为了line类型的subtype
			.sort(function(a, b)
			{
				return a[0].range[0] > b[0].range[0] ? 1 : -1;
			})
			.forEach(function(args)
			{
				var args0 = args[0];
				var args1 = args[1];
				var args2 = args[2];

				if (!args0 || !args0.value) return;
				if (args0.type != 'Literal')
				{
					dirtyAsts.push(
					{
						reason	: 'I18N args[0] is not literal',
						code	: escodegen.generate(args0, optionsUtils.escodegenOptions),
						ast		: args0
					});
					return;
				}

				// 需要提取后面两个参数数据
				var value = (''+args0.value).trim();
				if (!value)
				{
					debug('blank i18n args:%s', args0.value);
					return;
				}

				var subtype = args1 && astUtils.ast2constVal(args1);


				if (subtype)
				{
					var arr = codeTranslateWords.SUBTYPES[subtype]
						|| (codeTranslateWords.SUBTYPES[subtype] = []);

					arr.push(value);
				}
				else
				{
					codeTranslateWords.DEFAULTS.push(value);
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

						if (!astUtils.checkAstFlag(ast, AST_FLAGS.VALID_I18N))
						{
							i18nPlaceholder.renderType = 'simple';
						}

						newCode.push(i18nPlaceholder);
						i18nPlaceholders.push(i18nPlaceholder);
						break;

					case 'translateWord':
						var myCode = escodegen.generate(ast.__i18n_replace_info__.newAst, optionsUtils.escodegenOptions);
						newCode.push(myCode);
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
		});


		return {
			code				: resultCode,
			// 脏数据 (包含子作用域)
			dirtyAsts			: dirtyAsts,
			// 从代码中获取到的关键字 (包含子作用域)
			codeTranslateWords	: codeTranslateWords,
			// 从i18n函数中解出来的翻译数据 (包含子作用域)
			funcTranslateWords	: funcTranslateWords,
			// 处理后，正在使用的翻译数据 (包含子作用域)
			usedTranslateWords	: usedTranslateWords,
		};
	}
});

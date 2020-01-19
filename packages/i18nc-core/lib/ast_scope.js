'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc-core:ast_scope');
const i18ncAst = require('i18nc-ast');
const astTpl = i18ncAst.tpl;
const astUtil = i18ncAst.util;
const DEF = require('./def');
const I18NPlaceholder = require('./i18n_placeholder').I18NPlaceholder;
const ArrayPush = Array.prototype.push;
const AST_FLAGS = i18ncAst.AST_FLAGS;
const UNSUPPORT_AST_TYPS = DEF.UNSUPPORT_AST_TYPS;

const ResultObject = require('./result_object');
const DirtyWords = ResultObject.DirtyWords;
const CodeTranslateWords = ResultObject.CodeTranslateWords;
const FuncTranslateWords = ResultObject.FuncTranslateWords;
const UsedTranslateWords = ResultObject.UsedTranslateWords;
const TranslateWords = ResultObject.TranslateWords;
const CodeInfoResult = ResultObject.CodeInfoResult;

let I18NC;

function runNewI18NC(code, ast, options, originalCode, isInsertHandler) {
	// 存在循环应用，所以在调用的时候，再require
	if (!I18NC) I18NC = require('./main');
	options.I18NHandler.insert.enable = false;
	const codeIndent = astUtil.codeIndent(ast, originalCode);
	let newCode = I18NC.run(code, options).code;
	newCode = newCode.split('\n').join('\n' + codeIndent);
	options.I18NHandler.insert.enable = isInsertHandler;

	return newCode;
}

exports.ASTScope = ASTScope;

function ASTScope(ast, type) {
	this.ast = ast;
	// type:
	// define factory
	// top
	this.type = type;

	this.I18NArgs = [];
	this.I18NHandlerAsts = [];
	this.translateWordAsts = [];

	this.subScopes = [];
}

_.extend(ASTScope.prototype, {
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
	squeeze: function(isKeepDefineFactoryScope, options) {
		const self = this;

		if (!self.subScopes.length) return self;
		// 如果已经定义了I18N函数，则不进行define的闭包
		if (self.I18NHandlerAsts.length) isKeepDefineFactoryScope = false;
		// 只保留一层define，嵌套的不处理
		if (self.type == 'define factory') isKeepDefineFactoryScope = false;

		const newScope = new ASTScope(self.ast, self.type);
		newScope._merge(this);

		self.subScopes.forEach(function(scope) {
			const scope2 = scope.squeeze(isKeepDefineFactoryScope, options);

			// 已经有I18N函数
			if (
				scope2.I18NHandlerAsts.length ||
				// 对define函数调用进行特殊处理
				(isKeepDefineFactoryScope && scope2.type == 'define factory') ||
				// 如果是顶层，又希望闭包的时候，把I18N函数插入到第二层
				(self.type == 'top' && options.I18NHandler.insert.checkClosure)
			) {
				newScope.subScopes.push(scope2);
			}
			// 合并数据
			else {
				newScope._merge(scope2);

				if (scope2.subScopes.length) {
					ArrayPush.apply(newScope.subScopes, scope2.subScopes);
				}
			}
		});

		return newScope;
	},

	_merge: function(scope) {
		// 不合并subScopes
		// subScopes会在后续进行判断之后看需要进行合并
		ArrayPush.apply(this.I18NArgs, scope.I18NArgs);
		ArrayPush.apply(this.I18NHandlerAsts, scope.I18NHandlerAsts);
		ArrayPush.apply(this.translateWordAsts, scope.translateWordAsts);
	},

	/**
	 * 获取自身除I18N函数之外的translateInfo
	 */
	_codeTranslateWordInfoOfSelf: function(options) {
		const scope = this;
		const dirtyWords = new DirtyWords();
		const allCodeTranslateWords = new CodeTranslateWords();
		const myCodeTranslateWords = new CodeTranslateWords();

		const aliasCodeTranslateWords = {};
		const IGNORE_translateWord = !options.codeModifyItems.TranslateWord;
		const IGNORE_regexp = !options.codeModifyItems.TranslateWord_RegExp;

		scope.translateWordAsts.forEach(function(ast) {
			if (astUtil.checkAstFlag(ast, AST_FLAGS.DIS_REPLACE)) {
				const ret = _.some(UNSUPPORT_AST_TYPS, function(flag, name) {
					if (astUtil.checkAstFlag(ast, flag)) {
						dirtyWords.add(
							ast,
							'Not Support Ast `' + name + '` yet'
						);
						return true;
					}
				});

				if (!ret) dirtyWords.add(ast, 'This ast can\'t use I18N');
			} else if (
				IGNORE_translateWord ||
				(IGNORE_regexp && ast.value instanceof RegExp)
			) {
				dirtyWords.add(ast, 'Text Replacer Not Enabled');
			} else {
				allCodeTranslateWords.pushNewWord(ast);
				myCodeTranslateWords.pushNewWord(ast);
			}
		});

		scope.I18NArgs.filter(function(argsInfo) {
			return argsInfo && argsInfo.translateWordAst;
		}).forEach(function(argsInfo) {
			const translateWordAst = argsInfo.translateWordAst;
			const subkeyAst = argsInfo.subkeyAst;

			if (!translateWordAst || !translateWordAst.value) return;
			if (translateWordAst.type != 'Literal') {
				dirtyWords.add(translateWordAst, 'I18N args[0] is not literal');
				return;
			}

			// 需要提取后面两个参数数据
			const value = ('' + translateWordAst.value).trim();
			if (!value) {
				debug('blank i18n args:%s', translateWordAst.value);
				return;
			}

			const subkey = subkeyAst && astUtil.ast2constVal(subkeyAst);

			if (subkey)
				allCodeTranslateWords.pushSubkey(subkey, translateWordAst);
			else allCodeTranslateWords.pushWraped(translateWordAst);

			const alias = argsInfo.alias;
			let aliasCodes;
			if (alias) {
				aliasCodes =
					aliasCodeTranslateWords[alias] ||
					(aliasCodeTranslateWords[alias] = new CodeTranslateWords());
			} else {
				aliasCodes = myCodeTranslateWords;
			}

			if (subkey) aliasCodes.pushSubkey(subkey, translateWordAst);
			else aliasCodes.pushWraped(translateWordAst);
		});

		// 这里的数据，均不包含子域
		return {
			// 脏数据
			dirtyWords: dirtyWords,
			// 从代码中获取到的关键
			allCodeTranslateWords: allCodeTranslateWords,
			myCodeTranslateWords: myCodeTranslateWords,
			aliasCodeTranslateWords: aliasCodeTranslateWords
		};
	},

	// 处理code的核心代码
	codeAndInfo: function(tmpCode, originalCode, options) {
		const scope = this;
		let codeFixOffset = scope.ast.range[0];
		let codeStartPos = 0;
		let dealAst = [];
		const newCodes = [];
		const selfTWords = scope._codeTranslateWordInfoOfSelf(options);
		const isInsertHandler = options.I18NHandler.insert.enable;

		const allCodeTranslateWordsJSON = selfTWords.allCodeTranslateWords.toJSON();
		const myCodeTranslateWordsJSON = selfTWords.myCodeTranslateWords.toJSON();

		const selfFuncTranslateWords = new FuncTranslateWords();
		const originalFileKeys = [];

		const REPLACE_I18NHandler_alias =
			options.codeModifyItems.I18NHandlerAlias;

		// 预处理 I18N函数 begin
		const I18NHandlerAsts = scope.I18NHandlerAsts.sort(function(a, b) {
			return a.range[0] > b.range[0] ? 1 : -1;
		});
		let lastI18NHandlerAst;
		const lastI18NHandlerAliasAsts = {};
		for (let i = I18NHandlerAsts.length; i--; ) {
			const item = I18NHandlerAsts[i];
			if (astUtil.checkAstFlag(item, AST_FLAGS.I18N_ALIAS)) {
				const handlerName = item.id && item.id.name;
				if (!lastI18NHandlerAliasAsts[handlerName]) {
					lastI18NHandlerAliasAsts[handlerName] = item;
				}
			} else {
				if (!lastI18NHandlerAst) lastI18NHandlerAst = item;
			}
		}

		I18NHandlerAsts.forEach(function(ast) {
			dealAst.push({
				type: 'I18NHandler',
				value: ast
			});
		});
		// 预处理 I18N函数 end

		if (REPLACE_I18NHandler_alias) {
			scope.I18NArgs.forEach(function(item) {
				if (
					astUtil.checkAstFlag(item.calleeAst, AST_FLAGS.I18N_ALIAS)
				) {
					dealAst.push({
						type: 'I18NAliasCallee',
						value: item.calleeAst
					});
				}
			});
		}

		scope.subScopes.forEach(function(item) {
			dealAst.push({
				type: 'scope',
				value: item.ast,
				scope: item
			});
		});

		selfTWords.allCodeTranslateWords.list.forEach(function(item) {
			if (
				item.type == 'new' &&
				!astUtil.checkAstFlag(
					item.originalAst,
					AST_FLAGS.SKIP_REPLACE | AST_FLAGS.DIS_REPLACE
				)
			) {
				dealAst.push({
					type: 'translateWord',
					value: item.originalAst
				});
			}
		});

		// 插入一个默认的翻译函数
		// 注意，alias不会进行处理，
		// 如果保留alias，但alias本身没有placeholder，处理逻辑也不会忘代码里面插入placeholder
		const I18NPlaceholderNew = new I18NPlaceholder(
			REPLACE_I18NHandler_alias
				? allCodeTranslateWordsJSON
				: myCodeTranslateWordsJSON,
			originalCode,
			options
		);
		if (scope.ast.type == 'BlockStatement') {
			codeStartPos++;

			// 如果是在结构体内，那么至少要缩进一个tab
			const _originalI18nPlaceholderNewToString =
				I18NPlaceholderNew.toString;
			I18NPlaceholderNew.toString = function() {
				const str = _originalI18nPlaceholderNewToString.apply(
					this,
					arguments
				);
				if (!str) return str;

				const codeIndent =
					astUtil.codeIndent(scope.ast, originalCode) + '\t';

				return str
					.split('\n')
					.map(function(val) {
						return val.trim() ? codeIndent + val : val;
					})
					.join('\n');
			};
		}
		newCodes.push(tmpCode.slice(0, codeStartPos), I18NPlaceholderNew);
		tmpCode = tmpCode.slice(codeStartPos);
		codeFixOffset += codeStartPos;

		dealAst = dealAst.sort(function(a, b) {
			return a.value.range[0] > b.value.range[0] ? 1 : -1;
		});

		if (dealAst.length > 1) {
			dealAst.reduce(function(a, b) {
				// 整理包含关系
				if (a.value.range[1] > b.value.range[0]) {
					a.include = true;
					b.included = true;
					return a;
				}

				return b;
			});
		}

		// 逐个处理需要替换的数据
		const myI18NPlaceholderList = [];
		const aliasI18NPlaceholderList = [];
		const allI18NPlaceholderList = [];
		const subScopeDatas = [];
		dealAst.forEach(function(item) {
			// 被包含的元素，不进行处理
			if (item.included) return;

			const ast = item.value;
			const codeStartPos = ast.range[0] - codeFixOffset;
			const codeEndPos = ast.range[1] - codeFixOffset;

			newCodes.push(tmpCode.slice(0, codeStartPos));
			let newCode;

			switch (item.type) {
				case 'I18NAliasCallee': {
					const myAst = astTpl.CallExpression(
						options.I18NHandlerName,
						ast.arguments
					);
					newCode = astUtil.tocode(myAst);
					break;
				}

				case 'I18NHandler': {
					const handlerName = ast.id && ast.id.name;
					const isAliasHandler = astUtil.checkAstFlag(
						ast,
						AST_FLAGS.I18N_ALIAS
					);
					let codeJSON;
					if (REPLACE_I18NHandler_alias) {
						debug('use all code json');
						codeJSON = allCodeTranslateWordsJSON;
					} else if (isAliasHandler) {
						debug('use alias code json');
						codeJSON =
							(selfTWords.aliasCodeTranslateWords[handlerName] &&
								selfTWords.aliasCodeTranslateWords[
									handlerName
								].toJSON()) ||
							{};
					} else {
						debug('use my code json');
						codeJSON = myCodeTranslateWordsJSON;
					}

					const myPlaceholder = new I18NPlaceholder(
						codeJSON,
						originalCode,
						options,
						ast
					);

					if (
						!isAliasHandler &&
						ast !== lastI18NHandlerAst &&
						isAliasHandler &&
							ast !== lastI18NHandlerAliasAsts[handlerName]
					) {
						// 函数保留，但翻译数据全部不要
						// 翻译数据，全部以po文件或者最后的函数为准
						myPlaceholder.renderType = 'simple';
					}

					allI18NPlaceholderList.push(myPlaceholder);
					if (!REPLACE_I18NHandler_alias && isAliasHandler) {
						aliasI18NPlaceholderList.push(myPlaceholder);
					} else {
						myPlaceholder.handlerName = options.I18NHandlerName;
						myI18NPlaceholderList.push(myPlaceholder);
					}

					newCode = myPlaceholder;
					break;
				}

				case 'translateWord':
					newCode = astUtil.tocode(ast.__i18n_replace_info__.newAst);
					break;

				case 'scope': {
					const scopeData = item.scope.codeAndInfo(
						tmpCode.slice(codeStartPos, codeEndPos),
						originalCode,
						options
					);
					newCode = scopeData.code;
					subScopeDatas.push(scopeData);
					break;
				}

				default:
					debug('undefind type:%s ast:%o', item.type, ast);
					newCode = tmpCode.slice(codeStartPos, codeEndPos);
			}

			if (
				item.include &&
				newCode != tmpCode.slice(codeStartPos, codeEndPos)
			) {
				// 包含情况下，对结果再允许一次i18nc解析
				newCode = runNewI18NC(
					newCode,
					ast,
					options,
					originalCode,
					isInsertHandler
				);
			}

			newCodes.push(newCode);

			tmpCode = tmpCode.slice(codeEndPos);
			codeFixOffset += codeEndPos;
		});

		// 如果作用域中，已经有I18N函数
		// 那么头部插入的函数就不需要了
		if (!isInsertHandler || myI18NPlaceholderList.length) {
			debug('ignore insert new I18NHandler');
			I18NPlaceholderNew.renderType = 'empty';
		}

		// 输出最终代码
		const resultCode = newCodes.join('') + tmpCode;

		if (
			isInsertHandler &&
			options.I18NHandler.insert.checkClosure &&
			scope.type == 'top' &&
			I18NPlaceholderNew.getRenderType() == 'complete'
		) {
			throw new Error('closure by youself');
		}

		// 进行最后的附加数据整理、合并
		myI18NPlaceholderList
			.concat(aliasI18NPlaceholderList)
			.forEach(function(I18NPlaceholder) {
				const info = I18NPlaceholder.parse();
				const FILE_KEY = info.__FILE_KEY__;
				originalFileKeys.push(FILE_KEY);

				selfFuncTranslateWords.add(FILE_KEY, info.__TRANSLATE_JSON__);
			});

		const currentI18NHandler =
			allI18NPlaceholderList[allI18NPlaceholderList.length - 1] ||
			I18NPlaceholderNew;
		const usedTranslateWords = new UsedTranslateWords();
		usedTranslateWords.add(
			currentI18NHandler.parse().__FILE_KEY__,
			currentI18NHandler.getTranslateJSON()
		);
		const selfScopeData = new CodeInfoResult({
			code: resultCode,
			currentFileKey: currentI18NHandler.parse().__FILE_KEY__,
			originalFileKeys: originalFileKeys,
			subScopeDatas: subScopeDatas,
			// 脏数据
			dirtyWords: selfTWords.dirtyWords,
			words: new TranslateWords(
				selfTWords.allCodeTranslateWords,
				selfFuncTranslateWords,
				usedTranslateWords
			)
		});

		// 返回数据，不包含子域数据
		return selfScopeData;
	}
});

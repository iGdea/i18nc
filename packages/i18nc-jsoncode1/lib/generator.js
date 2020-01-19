'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc-jsoncode:generate');
const i18ncAst = require('i18nc-ast');
const astTpl = i18ncAst.tpl;
const astUtil = i18ncAst.util;
const AST_FLAGS = i18ncAst.AST_FLAGS;

exports.toTranslateJSON = function(json) {
	return json;
};

exports.fillNoUsedCodeTranslateWords = fillNoUsedCodeTranslateWords;
/**
 * 针对toTranslateJSON结果，将没有翻译的词条，生成注释
 */
function fillNoUsedCodeTranslateWords(
	translateDataJSON,
	codeTranslateWords,
	defaultLanguage
) {
	let lans = Object.keys(translateDataJSON);
	if (!lans.length) lans = [defaultLanguage];

	const DEFAULTS_WORDS = _.uniq(codeTranslateWords.DEFAULTS);
	if (DEFAULTS_WORDS.length) {
		lans.forEach(function(lan) {
			const lanItem =
				translateDataJSON[lan] || (translateDataJSON[lan] = {});
			const result = lanItem.DEFAULTS || (lanItem.DEFAULTS = {});
			_.each(DEFAULTS_WORDS, function(word) {
				if (!result[word]) result[word] = null;
			});
		});
	}

	_.each(codeTranslateWords.SUBKEYS, function(subkey_words, subkey) {
		const SUBKEY_WORDS = _.uniq(subkey_words);
		if (!SUBKEY_WORDS.length) return;

		lans.forEach(function(lan) {
			let lanItem = translateDataJSON[lan] || (translateDataJSON[lan] = {});
			lanItem = lanItem.SUBKEYS || (lanItem.SUBKEYS = {});
			const result = lanItem[subkey] || (lanItem[subkey] = {});

			_.each(SUBKEY_WORDS, function(word) {
				if (!result[word]) result[word] = null;
			});
		});
	});
}

exports.genTranslateJSONCode = genTranslateJSONCode;
/**
 * 结果转code
 */
function genTranslateJSONCode(translateData) {
	debug('translateData:%o', translateData);

	const ast = _translateJSON2ast(translateData);
	if (ast) {
		let code = astUtil.tocode(ast);
		code = code.replace(/,?\s*(['"])\1 *: *null/g, '');
		return code;
	} else {
		return '{}';
	}
}

exports._translateJSON2ast = _translateJSON2ast;
/**
 * 将toTranslateJSON数据，转成ast表示
 * 对数据进行重新编排
 *
 * @param  {JSON} data toTranslateJSON  运行结果
 * @return {JSON}      test/output/generator/func_json.js
 */
function _translateJSON2ast(mainData) {
	const resultPropertiesAst = [];

	_.each(Object.keys(mainData).sort(), function(lan) {
		const translateData = mainData[lan];
		const lanPropertiesAst = [];

		// 处理DEFAULTS
		const tmp = _wordJson2ast(translateData.DEFAULTS);
		if (tmp) {
			lanPropertiesAst.push(astTpl.Property('DEFAULTS', tmp));
		}

		// 处理 SUBKEYS
		if (translateData.SUBKEYS) {
			const tmpSubkeysPropertiesAst = _.map(
				Object.keys(translateData.SUBKEYS).sort(),
				function(subkey) {
					const tmp = _wordJson2ast(translateData.SUBKEYS[subkey]);
					if (!tmp) return;

					return astTpl.Property(subkey, tmp);
				}
			).filter(function(val) {
				return val;
			});

			if (tmpSubkeysPropertiesAst.length) {
				lanPropertiesAst.push(
					astTpl.Property(
						'SUBKEYS',
						astTpl.ObjectExpression(tmpSubkeysPropertiesAst)
					)
				);
			}
		}

		if (lanPropertiesAst.length) {
			resultPropertiesAst.push(
				astTpl.Property(lan, astTpl.ObjectExpression(lanPropertiesAst))
			);
		}
	});

	if (resultPropertiesAst.length) {
		return astTpl.ObjectExpression(resultPropertiesAst);
	}
}

exports._wordJson2ast = _wordJson2ast;
/**
 * 将array表示的或关系转成ast表示
 */
function _wordJson2ast(words) {
	if (!words) return;
	const result = [];

	// 翻译为空的时候，把这些words转化成注释
	let emptyTranslateComments = [];

	// 先对object进行排序，保证尽可能少触发svn变更
	Object.keys(words)
		.sort()
		.forEach(function(val) {
			const translateWord = words[val];
			debug('wordJson2ast val:%s, translateWord:%o', val, translateWord);

			if (translateWord === null) {
				// 使用escodegen.generate替换JSON.stringify
				// JSON.stringify 会导致一些特殊字符不会encode，例如\u2029
				const keyStr = astUtil.tocode(astTpl.Literal(val));
				emptyTranslateComments.push(
					astTpl.LineComment(' ' + keyStr + ':')
				);
				return;
			}

			const valAst =
				translateWord == ''
					? astTpl.ArrayExpression([])
					: astUtil.constVal2ast(translateWord);

			const retAst = astTpl.Property(val, valAst);
			result.push(retAst);

			if (emptyTranslateComments.length) {
				retAst.leadingComments = emptyTranslateComments;
				emptyTranslateComments = [];
			}
		});

	if (emptyTranslateComments.length) {
		if (!result.length) {
			const protoKey = astTpl.Property('', astUtil.constVal2ast(null));
			astUtil.setAstFlag(protoKey, AST_FLAGS.PLACEHOLDER_WORDER);
			result.push(protoKey);
		}

		const lastItem = result[result.length - 1];
		lastItem.leadingComments = (lastItem.leadingComments || []).concat(
			emptyTranslateComments
		);
	}

	return astTpl.ObjectExpression(result);
}

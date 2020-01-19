'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc-jsoncode:parser');
const astUtil = require('i18nc-ast').util;

exports.translateAst2JSON = translateAst2JSON;

function translateAst2JSON(ast) {
	return codeJSON2translateJSON(_ast2json(ast));
}

/**
 * 将__TRANSLATE_JSON__值的ast，解成json对象
 */
function _ast2json(ast) {
	let lans = [];
	const translateJSON = {};
	let translateLansMaxLen = 0;

	ast.properties.forEach(function(translate_json_ast) {
		const key = astUtil.ast2constKey(translate_json_ast.key);
		const value = translate_json_ast.value;
		switch (key) {
			// 语言
			case '$':
				if (value.type != 'ArrayExpression') {
					throw new Error('LANGS KEY `$` ONLY MUST BE AN ARRAY');
				}
				lans = value.elements.map(astUtil.ast2constVal);
				break;

			// 翻译数据
			case '*':
			default: {
				if (value.type != 'ObjectExpression') {
					if (key == '*')
						throw new Error(
							'DEFAULT TRANSLATE JSON `*` MUST BE AN OBJECT'
						);
					else
						throw new Error(
							'SUBKEY TRANSLATE JSON MUST BE AN OBJECT'
						);
				}
				const lan_data = (translateJSON[key] = {});
				value.properties.forEach(function(ast) {
					const word = astUtil.ast2constKey(ast.key);
					const val = ast.value;
					if (val.type != 'ArrayExpression') {
						debug(
							'translate target err, word:%s ast:%o',
							word,
							val
						);
						throw new Error('TRANSLATE TARGET MUST BE AN ARRAY');
					}

					const targets = (lan_data[word] = val.elements.map(function(
						ast
					) {
						// 如果是null，说明是这种写法 [,,,,1]
						if (val == null) return undefined;
						return astUtil.ast2constVal(ast);
					}));

					translateLansMaxLen = Math.max(
						translateLansMaxLen,
						targets.length
					);
				});
			}
		}
	});

	if (translateLansMaxLen > lans.length) {
		debug('lans max len:%s, lans:%o', translateLansMaxLen, lans);
		throw new Error('LANGS OVERFLOW');
	}

	if (lans.length) translateJSON.$ = lans;

	return translateJSON;
}

exports.codeJSON2translateJSON = codeJSON2translateJSON;
/**
 * 将新的数据结构转化成普通的以语言为分类的结构体
 */
function codeJSON2translateJSON(translateJSON) {
	const result = {};
	const lans = translateJSON.$ || [];
	// 转数据结构，提速
	const translateJSON2 = Object.keys(translateJSON).map(function(subkey) {
		if (subkey == '$') return;

		return {
			subkey: subkey,
			items: _.map(translateJSON[subkey], function(values, word) {
				return { word: word, values: values };
			})
		};
	});

	lans.forEach(function(lan, lanIndex) {
		const lan_data = (result[lan] = {});

		translateJSON2.forEach(function(subkeyItem) {
			if (!subkeyItem) return;

			if (subkeyItem.subkey == '*') {
				lan_data.DEFAULTS = _getSubkeyJSON(subkeyItem, lanIndex);
			} else {
				const SUBKEYS_data = lan_data.SUBKEYS || (lan_data.SUBKEYS = {});
				SUBKEYS_data[subkeyItem.subkey] = _getSubkeyJSON(
					subkeyItem,
					lanIndex
				);
			}
		});
	});

	return result;
}

/**
 * 从多个语言翻译结果合并的数组中，找到对应语言的翻译数据
 * 是对一个语言包的一个subkey完整处理，不是单个词
 */
function _getSubkeyJSON(subkeyItem, lanIndex) {
	const result = {};

	_.each(subkeyItem.items, function(item) {
		let target = item.values[lanIndex];
		if (target === undefined || target === null) return;

		// 如果是数字，则进行一次转化
		// 和i18n_func 中的逻辑保持一致，只转一次
		if (typeof target == 'number') target = item.values[target];

		if (target !== undefined && target !== null) result[item.word] = target;
	});

	return result;
}

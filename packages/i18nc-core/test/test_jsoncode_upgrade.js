'use strict';

const _ = require('lodash');
const expect = require('expect.js');
const i18nc = require('../');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('jsoncode_upgrade');

describe('#jsoncode upgrade', function() {
	describe('#v1', function() {
		let code = require('./files/casefile/i18n_handler/i18n_handler_jsoncode_v1').toString();
		const info = i18nc(code);
		const funcTranslateWords = info.allFuncTranslateWords();
		const dbTranslateWords = {
			version: 2,
			data: {
				'*': funcTranslateWords.toJSON()
			}
		};
		const funcTranslateWordsList = funcTranslateWords.words();
		code +=
			'\n\n' +
			_.map(funcTranslateWordsList.DEFAULTS, function(val) {
				return 'I18N("' + val + '")';
			}).join('\n') +
			'\n\n' +
			_.map(funcTranslateWordsList.SUBKEYS, function(vals, subkey) {
				return vals
					.map(function(val) {
						return 'I18N("' + val + '", "' + subkey + '")';
					})
					.join('\n');
			}).join('\n');

		it('#complete', function() {
			const info = i18nc(code, {
				dbTranslateWords: dbTranslateWords
			});

			// JSON.stringify 的时候，会把数组里面的 undefined 转成 null
			// 这里就提前转一下
			// 导致的结果是，生成的json文件里面，是null表示
			const myJSON = JSON.parse(
				JSON.stringify(autoTestUtils.JsonOfI18ncRet(info))
			);
			const outputJSON = requireAfterWrite('v1_complete.json', myJSON);
			const otherCode = requireAfterWrite(
				'v1_complete.js',
				autoTestUtils.wrapCode4pkg(info.code)
			);

			expect(myJSON).to.eql(outputJSON);
			expect(autoTestUtils.code2arr('' + info)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});

		it('#partial', function() {
			const info = i18nc(code, {
				dbTranslateWords: dbTranslateWords,
				I18NHandler: {
					upgrade: { checkVersion: false }
				}
			});
			const outputJSON = requireAfterWrite(
				'v1_partial.json',
				autoTestUtils.JsonOfI18ncRet(info)
			);
			const otherCode = requireAfterWrite(
				'v1_partial.js',
				autoTestUtils.wrapCode4pkg(info.code)
			);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr('' + info)).to.eql(
				autoTestUtils.code2arr(otherCode)
			);
		});
	});
});

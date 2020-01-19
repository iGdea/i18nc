'use strict';

const expect = require('expect.js');
const i18nc = require('../');
const autoTestUtils = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('i18n_alias');

describe('#I18N_handler_alias', function() {
	it('#update', function() {
		const code = require('./files/casefile/func_code/func_code_i18n').toString();
		const info = i18nc(code, {
			I18NHandlerName: 'I18NNew',
			I18NHandlerAlias: ['I18N']
		});

		const otherContent = requireAfterWrite('i18n_alias_update.js', info.code);

		expect(autoTestUtils.code2arr(info.code)).to.eql(
			autoTestUtils.code2arr(otherContent)
		);
	});

	describe('#update', function() {
		it('#alias & new words', function() {
			const code = require('./files/casefile/func_code/func_code_i18n').toString();
			const info = i18nc(code, {
				I18NHandlerName: 'I18NNew',
				I18NHandlerAlias: ['I18N'],
				codeModifiedArea: ['I18NHandler', 'TranslateWord']
			});

			const otherContent = requireAfterWrite(
				'i18n_alias_no_update.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherContent)
			);
		});

		it('#only alias', function() {
			const code = require('./files/casefile/func_code/func_code_i18n_all').toString();
			const info = i18nc(code, {
				I18NHandlerName: 'I18NNew',
				I18NHandlerAlias: ['I18N'],
				codeModifiedArea: ['I18NHandler', 'TranslateWord']
			});

			const otherContent = requireAfterWrite(
				'i18n_all_alias_no_update.js',
				info.code
			);

			expect(autoTestUtils.code2arr(info.code)).to.eql(
				autoTestUtils.code2arr(otherContent)
			);
		});
	});
});

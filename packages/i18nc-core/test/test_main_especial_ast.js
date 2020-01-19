'use strict';

const debug = require('debug')('i18nc-core:test_main_especial_ast');
const expect = require('expect.js');
const i18nc = require('../');

describe('#main especial ast', function() {
	describe('#regexp', function() {
		it('#no replace', function() {
			const info = i18nc('var a = /\\ds/g', {
				codeModifiedArea: {
					I18NHandler: false,
					TranslateWord_RegExp: true
				}
			});

			expect(info.code).to.be('var a = /\\ds/g');
		});

		describe('#replace', function() {
			it('#base', function() {
				const code = 'var a = /%%%d简体%u4e2d%u6587%s/g'.replace(
					/%/g,
					'\\'
				);
				const otherCode = 'var a = new RegExp(I18N(\'%%%%%%d简体%%u4e2d%%u6587%%s\'), \'g\')'.replace(
					/%/g,
					'\\'
				);
				debug('orignal code:%s, expect code: %s', code, otherCode);

				const info = i18nc(code, {
					codeModifiedArea: {
						I18NHandler: false,
						TranslateWord_RegExp: true
					}
				});

				expect(info.code).to.be(otherCode);
			});

			it('#no beautify', function() {
				const code = 'var a = /%%%d简。体%s/g'.replace(/%/g, '\\');
				const otherCode = 'var a = new RegExp(I18N(\'%%%%%%d简。体%%s\'), \'g\')'.replace(
					/%/g,
					'\\'
				);
				debug('orignal code:%s, expect code: %s', code, otherCode);

				const info = i18nc(code, {
					codeModifiedArea: {
						I18NHandler: false,
						TranslateWord_RegExp: true
					}
				});

				expect(info.code).to.be(otherCode);
			});

			it('#split words', function() {
				const code = 'var a = /简>体/g';
				const otherCode =
					'var a = new RegExp(I18N(\'简\') + \'>\' + I18N(\'体\'), \'g\')';

				const info = i18nc(code, {
					codeModifiedArea: {
						I18NHandler: false,
						TranslateWord_RegExp: true
					}
				});

				expect(info.code).to.be(otherCode);
			});
		});
	});

	describe('#object key', function() {
		it('#no replace', function() {
			const info = i18nc('var a = {"中。文": 1}', {
				codeModifiedArea: { I18NHandler: false }
			});
			expect(info.code).to.be('var a = {"中。文": 1}');
		});
	});
});

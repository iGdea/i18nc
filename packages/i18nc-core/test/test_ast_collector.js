'use strict';

const expect = require('expect.js');
const ASTCollector = require('../lib/ast_collector').ASTCollector;
const initOptions = require('i18nc-options').init;
const i18ncAst = require('i18nc-ast');
const astUtil = i18ncAst.util;
const i18nc = require('../');
const blockModifierFuncs = require('./files/casefile/func_code/func_code_block_modifier');
const AST_FLAGS = i18ncAst.AST_FLAGS;

describe('#ASTCollector', function() {
	describe('#block modifier', function() {
		describe('#types', function() {
			it('#skip_scan', function() {
				const code = blockModifierFuncs.skip_scan;
				const scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文']);
			});

			it('#skip_replace', function() {
				const code = blockModifierFuncs.skip_replace;

				const scope = getFinalCollect(code);
				expect(
					!!astUtil.checkAstFlag(
						scope.translateWordAsts[0],
						AST_FLAGS.SKIP_REPLACE
					)
				).to.be(false);
				expect(
					!!astUtil.checkAstFlag(
						scope.translateWordAsts[1],
						AST_FLAGS.SKIP_REPLACE
					)
				).to.be(true);
				expect(getScopeCodeTranslateWord(scope)).to.eql(
					['中文', '这个中文还在skip_replace'].sort()
				);
			});

			it('#skip_scan@I18N', function() {
				const code = blockModifierFuncs.skip_scan_I18N;
				const scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql([
					'中文',
					'这个中文还在skip_scan@I18N2'
				]);
			});

			it('#skip_replace@I18N', function() {
				const code = blockModifierFuncs.skip_replace_I18N;

				const scope = getFinalCollect(code);
				expect(
					!!astUtil.checkAstFlag(
						scope.translateWordAsts[0],
						AST_FLAGS.SKIP_REPLACE
					)
				).to.be(false);
				expect(
					!!astUtil.checkAstFlag(
						scope.translateWordAsts[1],
						AST_FLAGS.SKIP_REPLACE
					)
				).to.be(true);
				expect(getScopeCodeTranslateWord(scope)).to.eql(
					[
						'中文',
						'这个中文还在skip_replace@I18N',
						'这个中文还在skip_replace@I18N2'
					].sort()
				);
			});
		});

		describe('#check', function() {
			it('#in top', function() {
				const code = '"[i18nc] skip_scan"\nvar v1 = "中文";';
				const scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql([]);
			});

			it('#not first item', function() {
				const code = blockModifierFuncs.skip_scan_fail;
				const scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql([
					'中文',
					'跳不过这个中文skip_scan'
				]);
			});
		});
	});

	describe('#scopes', function() {
		const scopesFuncs = require('./files/casefile/func_code/func_code_scopes');
		it('#scopes', function() {
			const code = scopesFuncs.base;
			const scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope)).to.eql(
				['中文1', '中文2'].sort()
			);
		});

		it('#scopes and I18N', function() {
			const code = scopesFuncs.has_I18N;
			const scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(
				['中文1', '中文2'].sort()
			);
		});

		it('#scopes and define', function() {
			const code = scopesFuncs.has_define;
			const scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(
				['中文1', '中文2', '中文3'].sort()
			);
		});

		it('#scopes and defines', function() {
			const code = scopesFuncs.mulit_define;
			const scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(
				['中文1', '中文2', '中文3', '中文4'].sort()
			);
		});
	});

	describe('#events', function() {
		afterEach(function() {
			i18nc.off();
		});

		it('#cutword', function() {
			i18nc.on('cutword', function(emitData) {
				emitData.result = [
					{
						translateWord: true,
						value: emitData.originalString
					}
				];
			});

			const code = require('./files/casefile/func_code/func_code_collect')
				.no_words;
			const scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope)).to.eql(['1234']);
		});
	});
});

function getCollect(code, options) {
	const ast = astUtil.parse(code.toString());
	return new ASTCollector(initOptions(options)).collect(ast);
}

function getFinalCollect() {
	return getCollect.apply(this, arguments).squeeze();
}

function getScopeCodeTranslateWord(scope) {
	const words = scope.translateWordAsts
		.map(function(ast) {
			if (!astUtil.checkAstFlag(ast, AST_FLAGS.DIS_REPLACE)) {
				return ast.__i18n_replace_info__.translateWords;
			}
		})
		.filter(function(ast) {
			return ast;
		});

	return Array.prototype.concat.apply([], words).sort();
}

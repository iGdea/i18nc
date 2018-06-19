'use strict';

var expect				= require('expect.js');
var ASTCollector		= require('../lib/ast_collector').ASTCollector;
var optionsUtils		= require('../lib/options');
var astUtils			= require('../lib/ast_utils');
var i18nc				= require('../');
var blockModifierFuncs	= require('./files/casefile/func_code/func_code_block_modifier');

describe('#ASTCollector', function()
{
	describe('#block modifier', function()
	{
		describe('#types', function()
		{
			it('#skip_scan', function()
			{
				var code = blockModifierFuncs.skip_scan;
				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文']);
			});

			it('#skip_repalce', function()
			{
				var code = blockModifierFuncs.skip_repalce;

				var scope = getFinalCollect(code);
				expect(!!astUtils.checkAstFlag(scope.translateWordAsts[0], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(false);
				expect(!!astUtils.checkAstFlag(scope.translateWordAsts[1], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(true);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文', '这个中文还在'].sort());
			});

			it('#skip_scan@I18N', function()
			{
				var code = blockModifierFuncs.skip_scan_I18N;
				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文']);
			});

			it('#skip_repalce@I18N', function()
			{
				var code = blockModifierFuncs.skip_repalce_I18N;

				var scope = getFinalCollect(code);
				expect(!!astUtils.checkAstFlag(scope.translateWordAsts[0], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(false);
				expect(!!astUtils.checkAstFlag(scope.translateWordAsts[1], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(true);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文', '这个中文还在'].sort());
			});
		});

		describe('#check', function()
		{
			it('#in top', function()
			{
				var code = '"[i18nc] skip_scan"\nvar v1 = "中文";'
				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql([]);
			});

			it('#not first item', function()
			{
				var code = blockModifierFuncs.skip_scan_fail;
				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文', '跳不过这个中文']);
			});
		});
	});

	describe('#scopes', function()
	{
		var scopesFuncs = require('./files/casefile/func_code/func_code_scopes');
		it('#scopes', function()
		{
			var code = scopesFuncs.base;
			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope)).to.eql(['中文1','中文2'].sort());
		});

		it('#scopes and I18N', function()
		{
			var code = scopesFuncs.has_I18N;
			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(['中文1','中文2'].sort());
		});

		it('#scopes and define', function()
		{
			var code = scopesFuncs.has_define;
			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(['中文1','中文2','中文3'].sort());
		});

		it('#scopes and defines', function()
		{
			var code = scopesFuncs.mulit_define;
			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(['中文1','中文2','中文3','中文4'].sort());
		});

	});



	describe('#events', function()
	{
		afterEach(function()
		{
			i18nc.off();
		});

		it('#cutword', function()
		{
			i18nc.on('cutword', function(emitData)
			{
				emitData.result =
				[
					{
						translateWord: true,
						value: emitData.originalString
					}
				];
			});

			var code = require('./files/casefile/func_code/func_code_collect').no_words;
			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope)).to.eql(['1234']);
		});
	});

});


function getCollect(code, options)
{
	var ast = astUtils.parse(code.toString());
	return new ASTCollector(optionsUtils.extend(options)).collect(ast);
}

function getFinalCollect()
{
	return getCollect.apply(this, arguments).squeeze();
}

function getScopeCodeTranslateWord(scope)
{
	var words = scope.translateWordAsts.map(function(ast)
		{
			if (!astUtils.checkAstFlag(ast, astUtils.AST_FLAGS.DIS_REPLACE))
			{
				return ast.__i18n_replace_info__.translateWords;
			}
		})
		.filter(function(ast)
		{
			return ast;
		});

	return Array.prototype.concat.apply([], words).sort();
}

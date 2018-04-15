var expect			= require('expect.js');
var ASTCollector	= require('../lib/ast_collector').ASTCollector;
var optionsUtils	= require('../lib/options');
var astUtils		= require('../lib/ast_utils');
var i18nc			= require('../');

describe('#ASTCollector', function()
{
	describe('#block modifier', function()
	{
		describe('#types', function()
		{
			it('#skip_scan', function()
			{
				var code = function code()
				{
					var v1 = '中文';

					{
						"[i18nc] skip_scan"
						var v2 = "跳过这个中文";
					}
				}

				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文']);
			});

			it('#skip_repalce', function()
			{
				var code = function code()
				{
					var v1 = '中文';

					{
						"[i18nc] skip_repalce"
						var v2 = "这个中文还在";
					}
				}

				var scope = getFinalCollect(code);
				expect(!!astUtils.checkAstFlag(scope.translateWordAsts[0], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(false);
				expect(!!astUtils.checkAstFlag(scope.translateWordAsts[1], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(true);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文', '这个中文还在'].sort());
			});

			it('#skip_scan@I18N', function()
			{
				var code = function code()
				{
					var v1 = '中文';

					{
						"[i18nc] skip_scan@I18N"
						var v2 = "跳过这个中文";
					}
				}

				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文']);
			});

			it('#skip_repalce@I18N', function()
			{
				var code = function code()
				{
					var v1 = '中文';

					{
						"[i18nc] skip_repalce@I18N"
						var v2 = "这个中文还在";
					}
				}

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
				var code = function code()
				{
					var v1 = '中文';

					"[i18nc] skip_scan"
					var v2 = "跳不过这个中文";
				}
				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文', '跳不过这个中文']);
			});
		});
	});


	describe('#options', function()
	{
		describe('#comboLiteralMode', function()
		{
			var code = function code()
			{
				var a = '123'+'中文'+I18N('abc');
				var b = '简体';
			}

			it('#normal', function()
			{
				var scope = getFinalCollect(code);
				expect(getScopeCodeTranslateWord(scope)).to.eql(['中文', '简体'].sort());
			});

			it('#LITERAL', function()
			{
				var scope = getFinalCollect(code, {comboLiteralMode: 'LITERAL'});
				expect(getScopeCodeTranslateWord(scope)).to.eql(['123中文','简体'].sort());
			});

			it('#I18N', function()
			{
				var scope = getFinalCollect(code, {comboLiteralMode: 'I18N'});
				expect(getScopeCodeTranslateWord(scope)).to.eql(['123中文abc', '简体'].sort());
			});

			it('#no changed', function()
			{
				var code = function code()
				{
					var a = '简体'/111;
				}

				var scope = getFinalCollect(code, {comboLiteralMode: 'I18N_ALL'});
				expect(getScopeCodeTranslateWord(scope)).to.eql(['简体']);
			});
		});
	});


	describe('#scopes', function()
	{
		it('#scopes', function()
		{
			var code = function code()
			{
				var v1 = "中文1";

				function func2()
				{
					var v1 = "中文2";
				};
			};

			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope)).to.eql(['中文1','中文2'].sort());
		});

		it('#scopes and I18N', function()
		{
			var code = function code()
			{
				var v1 = "中文1";

				function func2()
				{
					var v1 = "中文2";
				};

				function I18N(){}
			};

			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(['中文1','中文2'].sort());
		});

		it('#scopes and define', function()
		{
			var code = function code()
			{
				var v1 = "中文1";

				function func2()
				{
					var v1 = "中文2";
				};

				define(function()
				{
					var v1 = "中文3"
				});
				function I18N(){};
			};

			var scope = getFinalCollect(code);
			expect(getScopeCodeTranslateWord(scope.subScopes[0])).to.eql(['中文1','中文2','中文3'].sort());
		});

		it('#scopes and defines', function()
		{
			var code = function code()
			{
				var v1 = "中文1";

				function func2()
				{
					var v1 = "中文2";
				};

				define(function()
				{
					var v1 = "中文3"
				});

				define('define', function()
				{
					var v1 = "中文4"
				});

				function I18N(){};
			};

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
				emitData.lineStrings =
				[
					{
						translateWord: true,
						value: emitData.value
					}
				];
			});

			var code = function code()
			{
				var v1 = '1234';
			}

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
	var words = scope.translateWordAsts.map(function(ast, index)
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

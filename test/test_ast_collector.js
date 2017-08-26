var esprima			= require('esprima');
var expect			= require('expect.js');
var ASTCollector	= require('../lib/ast_collector').ASTCollector;
var optionsUtils	= require('../lib/options');
var astUtils		= require('../lib/ast_utils');

describe('#ASTCollector', function()
{
	it('#skip_scan', function()
	{
		var code = function code()
		{
			var v1 = '中文';

			{
				"[i18nc]skip_scan"
				var v2 = "跳过这个中文";
			}
		}

		var scope = getFinalCollect(code);
		var words = scope.translateWordAsts.map(function(item)
			{
				return item.__i18n_replace_info__.translateWords;
			});

		expect(words).to.eql([['中文']]);
	});

	it('#skip_repalce', function()
	{
		var code = function code()
		{
			var v1 = '中文';

			{
				"[i18nc]skip_repalce"
				var v2 = "这个中文还在";
			}
		}

		var scope = getFinalCollect(code);
		var words = scope.translateWordAsts.map(function(item, index)
			{
				return item.__i18n_replace_info__.translateWords;
			});
		expect(!!astUtils.checkAstFlag(scope.translateWordAsts[0], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(false);

		expect(!!astUtils.checkAstFlag(scope.translateWordAsts[1], astUtils.AST_FLAGS.SKIP_REPLACE)).to.be(true);

		expect(words).to.eql([['中文'], ['这个中文还在']]);
	});

	it('#isIgnoreScanWarn', function()
	{
		var code = function code()
		{
			var v1 =
			{
				"中文key": "中文val"
			};
		};

		expect(getFinalCollect).withArgs(code)
			.to.throwException(/\[I18N\] Object property can't use i18n\./);

		expect(getFinalCollect).withArgs(code, {isIgnoreScanWarn: true})
			.to.not.throwException();
	});

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
		var words = scope.translateWordAsts.map(function(item, index)
			{
				return item.__i18n_replace_info__.translateWords;
			});

		expect(words).to.eql([['中文1'], ['中文2']]);
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
		var words = scope.subScopes[0].translateWordAsts.map(function(item, index)
			{
				return item.__i18n_replace_info__.translateWords;
			});

		expect(words).to.eql([['中文1'], ['中文2']]);
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
		var words = scope.subScopes[0].translateWordAsts.map(function(item, index)
			{
				return item.__i18n_replace_info__.translateWords;
			});

		expect(words).to.eql([['中文1'], ['中文2'], ['中文3']]);
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
		var words = scope.subScopes[0].translateWordAsts.map(function(item, index)
			{
				return item.__i18n_replace_info__.translateWords;
			});

		expect(words).to.eql([['中文1'], ['中文2'], ['中文3'], ['中文4']]);
	});
});


function getCollect(code, options)
{
	var ast = esprima.parse(code.toString(), optionsUtils.esprimaOptions);
	return new ASTCollector(optionsUtils.extend(options)).collect(ast);
}

function getFinalCollect()
{
	return getCollect.apply(this, arguments).squeeze();
}

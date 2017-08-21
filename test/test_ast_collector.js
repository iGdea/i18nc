var esprima			= require('esprima');
var expect			= require('expect.js');
var ASTCollector	= require('../lib/ast_collector').ASTCollector;
var optionsUtils	= require('../lib/options');

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

		var collect = getCollect(code);
		var words = collect.translateWordAsts.map(function(item)
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

		var collect = getCollect(code);
		var words = collect.translateWordAsts.map(function(item, index)
			{
				if (index == 1)
					expect(item.__i18n_skip_replace__).to.be(true);
				else
					expect(item.__i18n_skip_replace__).to.be(undefined);

				return item.__i18n_replace_info__.translateWords;
			});

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

		expect(getCollect).withArgs(code)
			.to.throwException(/\[I18N\] Object property can't use i18n\./);

		expect(getCollect).withArgs(code, {isIgnoreScanWarn: true})
			.to.not.throwException();
	});
});


function getCollect(code, options)
{
	var ast = esprima.parse(code.toString(), optionsUtils.esprimaOptions);
	return new ASTCollector(options).collect(ast);
}

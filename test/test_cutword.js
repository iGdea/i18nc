var expect			= require('expect.js');
var astTpl			= require('../lib/ast_tpl');
var escodegen		= require('escodegen');
var optionsUtils	= require('../lib/options');
var LiteralHandler	= require('../lib/ast_collector').LiteralHandler;

describe('#cutword', function()
{
	var options = optionsUtils.extend();
	var literalHandler = new LiteralHandler(options);

	it('#split', function()
	{
		expect(literalHandler.split('')).to.be(undefined);
		expect(literalHandler.split('11')).to.be(undefined);
		expect(literalHandler.split('中文')).to.eql(
			[
				{ translateWord: false, value: '' },
				{ translateWord: true, value: '中文' },
				{ translateWord: false, value: '' }
			]);
		expect(literalHandler.split('中文11')).to.eql(
			[
				{ translateWord: false, value: '' },
				{ translateWord: true, value: '中文11' },
				{ translateWord: false, value: '' }
			]);
		expect(literalHandler.split('中文 11')).to.eql(
			[
				{ translateWord: false, value: '' },
				{ translateWord: true, value: '中文 11' },
				{ translateWord: false, value: '' }
			]);
		expect(literalHandler.split('11<span>中文</span>中文11')).to.eql(
			[
				{ translateWord: false, value: '11<span>' },
				{ translateWord: true, value: '中文' },
				{ translateWord: false, value: '</span>' },
				{ translateWord: true, value: '中文11' },
				{ translateWord: false, value: '' }
			]);
	});


	it('#ast', function()
	{
		function txt2code(val)
		{
			var ast = literalHandler.handle(astTpl.Literal(val))[0]
					.__i18n_replace_info__.newAst;
			return escodegen.generate(ast, optionsUtils.escodegenMinOptions);
		}

		expect(txt2code('中文')).to.be("I18N('中文')");
		expect(txt2code('中文11')).to.be("I18N('中文11')");
		expect(txt2code('11<span>中文</span>中文11'))
			.to.be("'11<span>'+I18N('中文')+'</span>'+I18N('中文11')");
	});

});

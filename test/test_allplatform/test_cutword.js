'use strict';

var expect			= require('expect.js');
var escodegen		= require('escodegen');
var astTpl			= require('../../lib/ast_tpl');
var optionsUtils	= require('../../lib/options');
var LiteralHandler	= require('../../lib/ast_literal_handler').LiteralHandler;

describe('#cutword', function()
{
	var options = optionsUtils.extend();
	var literalHandler = new LiteralHandler(options);

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

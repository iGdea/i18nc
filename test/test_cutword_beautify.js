'use strict';

var expect				= require('expect.js');
var astTpl				= require('../lib/ast_tpl');
var escodegen			= require('escodegen');
var optionsUtils		= require('../lib/options');
var LiteralHandler		= require('../lib/ast_literal_handler').LiteralHandler;
var removeTplComment	= require('../lib/plugins/cutword_beautify/handlers/remove_tpl_comment');

describe('#cutword_beautify', function()
{
	describe('#base', function()
	{
		var options = optionsUtils.extend();
		var literalHandler = new LiteralHandler(options);

		function txt2code(val)
		{
			var ast = literalHandler.handle(astTpl.Literal(val))[0]
					.__i18n_replace_info__.newAst;
			return escodegen.generate(ast, optionsUtils.escodegenMinOptions);
		}

		describe('#tpl comments', function()
		{
			it('#base', function()
			{
				expect(txt2code('中文<!--注释-->词典')).to.be("I18N('中文词典')");
				expect(txt2code('中文<!--<!--注释1-->词典<!--注释2-->-->查阅'))
					.to.be("I18N('中文词典')+'-->'+I18N('查阅')");
			});

			it('#commentIndexs', function()
			{
				expect(removeTplComment._commentIndexs('12<!-- 345 -->678'))
					.to.eql([2, 11]);
				expect(removeTplComment._commentIndexs('12<!-- <!-- 345 --> -->678'))
					.to.eql([2, 16]);
			});
		});

		it('#trim', function()
		{
			expect(txt2code('<span>  中文 词典  </span>'))
				.to.be("'<span>  '+I18N('中文 词典')+'  </span>'");
			expect(txt2code(' 中文词典')).to.be("' '+I18N('中文词典')");
			expect(txt2code('中文词典 ')).to.be("I18N('中文词典')+' '");
			expect(txt2code(' 中文词典 ')).to.be("' '+I18N('中文词典')+' '");
		});

		it('#split symbol', function()
		{
			expect(txt2code('你好！出发了吗？第一点；第二点。出彩vs回家.111'))
				.to.be("I18N('你好！')+I18N('出发了吗？')+I18N('第一点；')+I18N('第二点。')+I18N('出彩vs回家.')+'111'");
			expect(txt2code('你好!!出发了吗?不走吗'))
				.to.be("I18N('你好!!')+I18N('出发了吗?')+I18N('不走吗')");
			expect(txt2code('你好!!出发了吗?不走吗？'))
				.to.be("I18N('你好!!')+I18N('出发了吗?')+I18N('不走吗？')");
		});
	});

});

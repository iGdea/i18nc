var debug  = require('debug')('i18nc-core:test_main_especial_ast');
var expect = require('expect.js');
var i18nc  = require('../');


describe('#main especial ast', function()
{
	describe('#regexp', function()
	{
		it('#no replace', function()
		{
			var info = i18nc('var a = /\\ds/g',
				{
					codeModifiedArea: {I18NHandler: false},
				});

			expect(info.code).to.be('var a = /\\ds/g');
		});

		it('#replace', function()
		{
			var code = 'var a = /%%%d简。体%s/g'.replace(/%/g, '\\');
			var otherCode = "var a = new RegExp(I18N('%%%%%%d简。') + I18N('体%%s'), 'g')".replace(/%/g, '\\');
			debug('orignal code:%s, expect code: %s', code, otherCode);

			var info = i18nc(code,
				{
					codeModifiedArea: {I18NHandler: false},
				});

			expect(info.code).to.be(otherCode);
		});
	});

	describe('#object key', function()
	{
		it('#no replace', function()
		{
			var info = i18nc('var a = {"中。文": 1}',
				{
					codeModifiedArea: {I18NHandler: false},
				});
			expect(info.code).to.be('var a = {"中。文": 1}');
		});
	});
});

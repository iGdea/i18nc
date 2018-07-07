'use strict';

var debug  = require('debug')('i18nc-core:test_main_especial_ast');
var expect = require('expect.js');
var i18nc  = require('../../');


describe('#main especial ast', function()
{
	describe('#regexp', function()
	{
		it('#no replace', function()
		{
			var info = i18nc('var a = /\\ds/g',
				{
					codeModifiedArea:
					{
						I18NHandler: false,
						TranslateWord_RegExp: true,
					},
				});

			expect(info.code).to.be('var a = /\\ds/g');
		});

		describe('#replace', function()
		{
			it('#base', function()
			{
				var code = 'var a = /%%%d简体%u4e2d%u6587%s/g'.replace(/%/g, '\\');
				var otherCode = "var a = new RegExp(I18N('%%%%%%d简体%%u4e2d%%u6587%%s'), 'g')".replace(/%/g, '\\');
				debug('orignal code:%s, expect code: %s', code, otherCode);

				var info = i18nc(code,
					{
						codeModifiedArea:
						{
							I18NHandler: false,
							TranslateWord_RegExp: true
						},
					});

				expect(info.code).to.be(otherCode);
			});

			it('#no beautify', function()
			{
				var code = 'var a = /%%%d简。体%s/g'.replace(/%/g, '\\');
				var otherCode = "var a = new RegExp(I18N('%%%%%%d简。体%%s'), 'g')".replace(/%/g, '\\');
				debug('orignal code:%s, expect code: %s', code, otherCode);

				var info = i18nc(code,
					{
						codeModifiedArea:
						{
							I18NHandler: false,
							TranslateWord_RegExp: true,
						},
					});

				expect(info.code).to.be(otherCode);
			});

			it('#split words', function()
			{
				var code = 'var a = /简>体/g';
				var otherCode = "var a = new RegExp(I18N('简') + '>' + I18N('体'), 'g')";

				var info = i18nc(code,
					{
						codeModifiedArea:
						{
							I18NHandler: false,
							TranslateWord_RegExp: true
						},
					});

				expect(info.code).to.be(otherCode);
			});
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

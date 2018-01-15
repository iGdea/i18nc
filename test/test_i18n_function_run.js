var expect	= require('expect.js');
var I18N	= require('./files/i18n_handler_example');

describe('#I18N function', function()
{
	describe('#lan:en', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'en';
		});

		it('#no msg', function()
		{
			expect(I18N()).to.be('undefined');
		});

		it('#number', function()
		{
			expect(I18N(11)).to.be('11');
		});

		it('#not match', function()
		{
			expect(I18N('not match')).to.be('not match');
		});

		it('#match default', function()
		{
			expect(I18N('中文6_empty')).to.be('in_file 4');
		});

		it('#match empty', function()
		{
			expect(I18N('中文5_empty')).to.be('');
		});

		it('#match subtype', function()
		{
			expect(I18N('中文0', 'subtype')).to.be('in_file subtye_zh0');
		});

		it('#no has subtype', function()
		{
			expect(I18N('中文0', 'not existst subtype')).to.be('in_file zh0');
		});
	});


	describe('#lan:zh', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'zh';
		});

		it('#match default', function()
		{
			expect(I18N('中文6_empty')).to.be('中文6_empty');
		});

		it('#match subtype', function()
		{
			expect(I18N('中文0', 'subtype')).to.be('中文0');
		});
	});


	describe('#lan:zh,en', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'zh,en';
		});

		it('#match default', function()
		{
			expect(I18N('中文6_empty')).to.be('in_file 4');
		});

		it('#match subtype', function()
		{
			expect(I18N('中文0', 'subtype')).to.be('in_file subtye_zh0');
		});
	});

	describe('#lan:tw,en', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'tw,en';
		});

		it('#match default', function()
		{
			expect(I18N('中文0')).to.be('中文0 in tw');
		});

		it('#match subtype', function()
		{
			expect(I18N('中文0', 'subtype')).to.be('in_file subtye_zh0');
		});
	});
});


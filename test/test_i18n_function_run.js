var expect	= require('expect.js');
var I18N	= require('./files/i18n_handler_example');

describe('#i18n_function_run', function()
{
	describe('#lan:en-US', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'en-US';
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


	describe('#lan:zh-CN', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'zh-CN';
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


	describe('#lan:zh-CN,en-US', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'zh-CN,en-US';
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

	describe('#lan:zh-TW,en-US', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'zh-TW,en-US';
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

	describe('#tpldata', function()
	{
		beforeEach(function()
		{
			global.__i18n_lan__ = 'en-US';
		});

		it('#base', function()
		{
			expect()
		});

		it('#I18N args', function()
		{
			console.log('@todo');
		});
	});

});

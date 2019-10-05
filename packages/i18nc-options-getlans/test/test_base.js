'use strict';

var expect = require('expect.js');
var getlans = require('./i18n_getlans');
var Domain = require('domain');


describe('#base', function()
{
	it('#webCookeAndProcssDomian', function()
	{
		var dm = Domain.create();
		dm.run(function()
		{
			dm.__i18n_lan__ = 'zh-tw,cht';
			var cache = {};
			expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
			expect(cache.p).to.be(1);
			expect(getlans.webCookeAndProcssDomian(cache)).to.be('zh-tw,cht');
		});
	});

	it('#webNavigatorAndProcessDomain', function()
	{
		var dm = Domain.create();
		dm.run(function()
		{
			dm.__i18n_lan__ = 'zh-tw,cht';
			var cache = {};
			expect(getlans.webNavigatorAndProcessDomain(cache)).to.be('zh-tw,cht');
			expect(cache.p).to.be(1);
			expect(getlans.webNavigatorAndProcessDomain(cache)).to.be('zh-tw,cht');
		});
	});
});

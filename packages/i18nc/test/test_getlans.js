var expect = require('expect.js');
var getlans = require('../util/getlans');
var getlansTest = getlans._test;

describe('#getlans', function()
{
	it('#req', function()
	{
		expect(getlansTest._getReqLan('zh-CN,zh;q=0.9', ['zh-tw']))
			.to.eql(['zh-cn', 'zh']);
		expect(getlansTest._getReqLan('zh-CN,zh;q=0.9', ['zh']))
			.to.eql(['zh-cn']);
	});

	it('#req4cn', function()
	{
		expect(getlansTest._getReqLan4cn('zh-CN,zh;q=0.9'))
			.to.eql([]);
		expect(getlansTest._getReqLan4cn('zh-TW,zh-CN;q=0.9,zh;q=0.8'))
			.to.eql(['zh-tw', 'cht']);
		expect(getlansTest._getReqLan4cn('zh-TW,en-US;q=0.9'))
			.to.eql(['zh-tw', 'en-us', 'cht', 'en']);
		expect(getlansTest._getReqLan4cn('en-US,zh-TW;q=0.9'))
			.to.eql(['en-us', 'zh-tw', 'en', 'cht']);
	});

	it('#filter', function()
	{
		expect(getlans.filter(['zh-hk', 'zh-tw', 'en-us'], ['zh-hk', 'en']))
			.to.eql(['zh-hk', 'en-us']);
	});
});

const expect = require('expect.js');
const getlans = require('../util/getlans');
const getlansTest = getlans._test;

describe('#getlans', function() {
	it('#req', function() {
		expect(getlansTest._getReqLan('zh-CN,zh;q=0.9', ['zh-tw'])).to.eql([
			'zh-cn',
			'zh'
		]);
		expect(getlansTest._getReqLan('zh-CN,zh;q=0.9', ['zh'])).to.eql([
			'zh-cn'
		]);
	});

	it('#req4cn', function() {
		expect(getlansTest._getReqLan4cn('zh-CN,zh;q=0.9')).to.eql(['zh-cn', 'zh']);
		expect(getlansTest._getReqLan4cn('zh-TW,zh-CN;q=0.9,zh;q=0.8')).to.eql([
			'zh-tw',
			'zh-cn',
			'zh'
		]);
		expect(getlansTest._getReqLan4cn('zh-TW,en-US;q=0.9')).to.eql([
			'zh-tw',
			'en-us'
		]);
		expect(getlansTest._getReqLan4cn('en-US,zh-TW;q=0.9')).to.eql([
			'en-us',
			'zh-tw'
		]);
	});

	it('#filter', function() {
		expect(
			getlans.filter(['zh-cn', 'zh-tw', 'en-us'], ['zh', 'en', 'cht'])
		).to.eql('zh');
	});
});

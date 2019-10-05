'use strict';

var expect = require('expect.js');
var jsoncode = require('../');

describe('#base', function()
{
	it('#getParser', function()
	{
		expect(jsoncode.getParser('1')).to.be(jsoncode.jsoncode.v1.parser);
		expect(jsoncode.getParser('a')).to.be(jsoncode.jsoncode.v1.parser);
		expect(jsoncode.getParser('A')).to.be(jsoncode.jsoncode.v1.parser);
		expect(jsoncode.getParser('H')).to.be(jsoncode.jsoncode.v2.parser);
	});

	it('#getGenerator', function()
	{
		expect(jsoncode.getGenerator('1')).to.be(jsoncode.jsoncode.v1.generator);
		expect(jsoncode.getGenerator('a')).to.be(jsoncode.jsoncode.v1.generator);
		expect(jsoncode.getGenerator('A')).to.be(jsoncode.jsoncode.v1.generator);
		expect(jsoncode.getGenerator('H')).to.be(jsoncode.jsoncode.v2.generator);
	});
});

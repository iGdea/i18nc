var expect = require('expect.js');
var i18nc  = require('../');


describe('#main especial ast', function()
{
	it('#regexp', function()
	{
		var info = i18nc('var a = /简。体\s/g',
			{
				isClosureWhenInsertedHead: false,
			});
		expect(info.code).to.be('var a = /简。体\s/g');
	});

	it('#object key', function()
	{
		var info = i18nc('var a = {"中。文": 1}',
			{
				isClosureWhenInsertedHead: false,
			});
		expect(info.code).to.be('var a = {"中。文": 1}');
	});
});

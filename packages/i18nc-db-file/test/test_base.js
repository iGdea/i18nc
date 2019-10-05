'use strict';

const expect            = require('expect.js');
const dbfile            = require('../');
const autoTestUtils     = require('./auto_test_utils');
const requireAfterWrite = autoTestUtils.requireAfterWrite('output');
const INPUT_PATH        = __dirname + '/input/';


describe('#base', function()
{
	describe('#async', function()
	{
		it('#po file', function()
		{
			return dbfile(INPUT_PATH + 'en-US.po')
				.then(function(json)
				{
					let otherJson = requireAfterWrite('en-US.json', json);
					expect(json).to.eql(otherJson);
				});
		});

		it('#js file', function()
		{
			return dbfile(INPUT_PATH + 'en-US.js')
				.then(function(json)
				{
					let otherJson = requireAfterWrite('en-US_js.json', json);
					expect(json).to.eql(otherJson);
				});
		});

		it('#dir', function()
		{
			return dbfile(INPUT_PATH)
				.then(function(json)
				{
					let otherJson = requireAfterWrite('all.json', json);
					expect(json).to.eql(otherJson);
				});
		});

		it('#object', function()
		{
			return dbfile(require('./input/en-US.js'))
				.then(function(json)
				{
					let otherJson = requireAfterWrite('en-US_obj.json', json);
					expect(json).to.eql(otherJson);
				});
		});

		it('#mulit args', function()
		{
			return dbfile([INPUT_PATH + 'en-US.po', INPUT_PATH + 'en-US.js'])
				.then(function(json)
				{
					let otherJson = requireAfterWrite('mulit.json', json);
					expect(json).to.eql(otherJson);
				});
		});
	});


	describe('#sync', function()
	{
		it('#po file', function()
		{
			let json = dbfile.sync(INPUT_PATH + 'en-US.po')
			let otherJson = requireAfterWrite('en-US.json', json);
			expect(json).to.eql(otherJson);
		});

		it('#js file', function()
		{
			let json = dbfile.sync(INPUT_PATH + 'en-US.js')
			let otherJson = requireAfterWrite('en-US_js.json', json);
			expect(json).to.eql(otherJson);
		});

		it('#dir', function()
		{
			let json = dbfile.sync(INPUT_PATH)
			let otherJson = requireAfterWrite('all.json', json);
			expect(json).to.eql(otherJson);
		});

		it('#object', function()
		{
			let json = dbfile.sync(require('./input/en-US.js'))
			let otherJson = requireAfterWrite('en-US_obj.json', json);
			expect(json).to.eql(otherJson);
		});

		it('#mulit args', function()
		{
			let json = dbfile.sync([INPUT_PATH + 'en-US.po', INPUT_PATH + 'en-US.js'])
			let otherJson = requireAfterWrite('mulit.json', json);
			expect(json).to.eql(otherJson);
		});
	});

});

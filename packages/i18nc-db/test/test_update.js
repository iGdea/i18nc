'use strict';

var expect				= require('expect.js');
var update				= require('../lib/update');
var dbTranslateWordsV1	= require('./files/casefile/translate_words_db/translate_words_db_v1.json');
var dbTranslateWordsV15	= require('./files/casefile/translate_words_db/translate_words_db_v1.5.json');
var dbTranslateWordsV2	= require('./files/casefile/translate_words_db/translate_words_db_v2.json');
var dbTranslateWordsV25	= require('./files/casefile/translate_words_db/translate_words_db_v2.5.json');
var dbTranslateWordsV3	= require('./files/casefile/translate_words_db/translate_words_db_v3.json');
var dbTranslateWordsV35	= require('./files/casefile/translate_words_db/translate_words_db_v3.5.json');

describe('#update', function()
{
	it('#v1', function()
	{
		expect(update(dbTranslateWordsV1)).to.eql(dbTranslateWordsV2);
	});

	it('#v1.5', function()
	{
		expect(update(dbTranslateWordsV15)).to.eql(dbTranslateWordsV2);
	});

	it('#v2', function()
	{
		expect(update(dbTranslateWordsV2)).to.eql(dbTranslateWordsV2);
	});

	it('#v2.5', function()
	{
		expect(update(dbTranslateWordsV25)).to.eql(dbTranslateWordsV2);
	});

	it('#v3', function()
	{
		expect(update(dbTranslateWordsV3)).to.eql(dbTranslateWordsV2);
	});

	it('#v3.5', function()
	{
		expect(update(dbTranslateWordsV35)).to.eql(dbTranslateWordsV2);
	});
});

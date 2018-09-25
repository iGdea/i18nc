'use strict';

var expect				= require('expect.js');
var options				= require('../../lib/options');
var dbTranslateWordsV1	= require('../files/casefile/translate_words_db/translate_words_db_v1');
var dbTranslateWordsV2	= require('../files/casefile/translate_words_db/translate_words_db_v2');
var dbTranslateWordsV3	= require('../files/casefile/translate_words_db/translate_words_db_v3');

describe('#translate words db', function()
{
	it('#v1', function()
	{
		var newDBTranslateWords = options.extend(
			{
				dbTranslateWords: dbTranslateWordsV1
			})
			.dbTranslateWords;

		expect(newDBTranslateWords).to.eql(dbTranslateWordsV2);
	});

	it('#v3', function()
	{
		var newDBTranslateWords = options.extend(
			{
				dbTranslateWords: dbTranslateWordsV3
			})
			.dbTranslateWords;

		expect(newDBTranslateWords).to.eql(dbTranslateWordsV2);
	});
});

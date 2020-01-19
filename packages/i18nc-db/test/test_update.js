'use strict';

const expect = require('expect.js');
const update = require('../lib/update');
const dbTranslateWordsV1 = require('./files/casefile/translate_words_db/translate_words_db_v1.json');
const dbTranslateWordsV15 = require('./files/casefile/translate_words_db/translate_words_db_v1.5.json');
const dbTranslateWordsV2 = require('./files/casefile/translate_words_db/translate_words_db_v2.json');
const dbTranslateWordsV25 = require('./files/casefile/translate_words_db/translate_words_db_v2.5.json');
const dbTranslateWordsV3 = require('./files/casefile/translate_words_db/translate_words_db_v3.json');
const dbTranslateWordsV35 = require('./files/casefile/translate_words_db/translate_words_db_v3.5.json');

describe('#update', function() {
	it('#v1', function() {
		expect(update(dbTranslateWordsV1)).to.eql(dbTranslateWordsV2);
	});

	it('#v1.5', function() {
		expect(update(dbTranslateWordsV15)).to.eql(dbTranslateWordsV2);
	});

	it('#v2', function() {
		expect(update(dbTranslateWordsV2)).to.eql(dbTranslateWordsV2);
	});

	it('#v2.5', function() {
		expect(update(dbTranslateWordsV25)).to.eql(dbTranslateWordsV2);
	});

	it('#v3', function() {
		expect(update(dbTranslateWordsV3)).to.eql(dbTranslateWordsV2);
	});

	it('#v3.5', function() {
		expect(update(dbTranslateWordsV35)).to.eql(dbTranslateWordsV2);
	});
});

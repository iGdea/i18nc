'use strict';

const expect = require('expect.js');
const initOptions = require('i18nc-options').init;
const wordsUtils = require('../lib/utils/words_utils');

describe('#words_utils', function() {
	describe('#splitValue2lineStrings', function() {
		describe('#width cutwordReg', function() {
			const options = initOptions();

			it('#no translateWord', function() {
				expect(
					wordsUtils.splitValue2lineStrings('', 'string', options)
				).to.be(undefined);
				expect(
					wordsUtils.splitValue2lineStrings('11', 'string', options)
				).to.be(undefined);
			});

			it('#only translateWord', function() {
				expect(
					wordsUtils.splitValue2lineStrings('中文', 'string', options)
				).to.eql([
					{
						translateWord: true,
						value: '中文',
						ignore: false,
						disconnected: false
					}
				]);
			});

			it('#mulit words type in line', function() {
				expect(
					wordsUtils.splitValue2lineStrings(
						'中文11',
						'string',
						options
					)
				).to.eql([
					{
						translateWord: true,
						value: '中文11',
						ignore: false,
						disconnected: false
					}
				]);
				expect(
					wordsUtils.splitValue2lineStrings(
						'中文 11',
						'string',
						options
					)
				).to.eql([
					{
						translateWord: true,
						value: '中文 11',
						ignore: false,
						disconnected: false
					}
				]);
			});

			it('#mulit words type in lines', function() {
				expect(
					wordsUtils.splitValue2lineStrings(
						'11<span>中文</span>中文11',
						'string',
						options
					)
				).to.eql([
					{
						translateWord: false,
						value: '11<span>',
						ignore: false,
						disconnected: false
					},
					{
						translateWord: true,
						value: '中文',
						ignore: false,
						disconnected: false
					},
					{
						translateWord: false,
						value: '</span>',
						ignore: false,
						disconnected: false
					},
					{
						translateWord: true,
						value: '中文11',
						ignore: false,
						disconnected: false
					}
				]);
			});
		});

		describe('#err cutwordReg', function() {
			it('#with capture', function() {
				const options = initOptions({
					cutwordReg: /(\W+)/g
				});
				expect(
					wordsUtils.splitValue2lineStrings(
						'11中文11词典',
						'string',
						options
					)
				).to.eql([
					{
						translateWord: false,
						value: '11',
						ignore: false,
						disconnected: false
					},
					{
						translateWord: true,
						value: '中文',
						ignore: false,
						disconnected: false
					},
					{
						translateWord: false,
						value: '11',
						ignore: false,
						disconnected: false
					},
					{
						translateWord: true,
						value: '词典',
						ignore: false,
						disconnected: false
					}
				]);
			});
		});

		describe('#widthout cutwordReg', function() {
			console.log('#@todo');
		});
	});

	describe('#getTranslateWordsFromLineStrings', function() {
		it('#all', function() {
			expect(
				wordsUtils.getTranslateWordsFromLineStrings([
					{ translateWord: true, value: 1 }
				])
			).to.eql([1]);
			expect(
				wordsUtils.getTranslateWordsFromLineStrings([
					{ translateWord: true, value: 1 },
					{ translateWord: true, value: 2 }
				])
			).to.eql([1, 2]);
		});

		it('#not translateWord', function() {
			expect(
				wordsUtils.getTranslateWordsFromLineStrings([
					{ translateWord: false, value: 1 },
					{ translateWord: true, value: 2 }
				])
			).to.eql([2]);
		});

		it('#ignore', function() {
			expect(
				wordsUtils.getTranslateWordsFromLineStrings([
					{ translateWord: true, ignore: true, value: 1 },
					{ translateWord: true, value: 2 }
				])
			).to.eql([2]);
		});
	});
});

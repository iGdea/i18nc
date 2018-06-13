'use strict';

var expect			= require('expect.js');
var optionsUtils	= require('../lib/options');
var wordsUtils		= require('../lib/words_utils');
var escodegen		= require('escodegen');
var esprima			= require('esprima');

describe('#words_utils', function()
{
	describe('#splitValue2lineStrings', function()
	{
		describe('#width cutWordReg', function()
		{
			var options = optionsUtils.extend();

			it('#no translateWord', function()
			{
				expect(wordsUtils.splitValue2lineStrings('', true, options)).to.be(undefined);
				expect(wordsUtils.splitValue2lineStrings('11', true, options)).to.be(undefined);
			});

			it('#only translateWord', function()
			{
				expect(wordsUtils.splitValue2lineStrings('中文', true, options)).to.eql(
					[
						{translateWord: false, value: '', ignore: false, disconnected: false},
						{translateWord: true, value: '中文', ignore: false, disconnected: false},
						{translateWord: false, value: '', ignore: false, disconnected: false}
					]);
			});

			it('#mulit words type in line', function()
			{
				expect(wordsUtils.splitValue2lineStrings('中文11', true, options)).to.eql(
					[
						{translateWord: false, value: '', ignore: false, disconnected: false},
						{translateWord: true, value: '中文11', ignore: false, disconnected: false},
						{translateWord: false, value: '', ignore: false, disconnected: false}
					]);
				expect(wordsUtils.splitValue2lineStrings('中文 11', true, options)).to.eql(
					[
						{translateWord: false, value: '', ignore: false, disconnected: false},
						{translateWord: true, value: '中文 11', ignore: false, disconnected: false},
						{translateWord: false, value: '', ignore: false, disconnected: false}
					]);
			});

			it('#mulit words type in lines', function()
			{
				expect(wordsUtils.splitValue2lineStrings('11<span>中文</span>中文11', true, options)).to.eql(
					[
						{translateWord: false, value: '11<span>', ignore: false, disconnected: false},
						{translateWord: true, value: '中文', ignore: false, disconnected: false},
						{translateWord: false, value: '</span>', ignore: false, disconnected: false},
						{translateWord: true, value: '中文11', ignore: false, disconnected: false},
						{translateWord: false, value: '', ignore: false, disconnected: false}
					]);
			});
		});

		describe('#widthout cutWordReg', function()
		{
			console.log('#@todo');
		});
	});


	describe('#getTranslateWordsFromLineStrings', function()
	{
		it('#all', function()
		{
			expect(wordsUtils.getTranslateWordsFromLineStrings([
					{translateWord: true, value: 1}
				]))
				.to.eql([1]);
			expect(wordsUtils.getTranslateWordsFromLineStrings([
					{translateWord: true, value: 1},
					{translateWord: true, value: 2}
				]))
				.to.eql([1, 2]);
		});

		it('#not translateWord', function()
		{
			expect(wordsUtils.getTranslateWordsFromLineStrings([
					{translateWord: false, value: 1},
					{translateWord: true, value: 2}
				]))
				.to.eql([2]);
		});

		it('#ignore', function()
		{
			expect(wordsUtils.getTranslateWordsFromLineStrings([
					{translateWord: true, ignore: true, value: 1},
					{translateWord: true, value: 2}
				]))
				.to.eql([2]);
		});
	});


	// it('#unescape4escodegen', function()
	// {
	// 	var ast = esprima.parse('"。；"');
	// 	var code = escodegen.generate(ast);
	//
	// 	expect(code).to.be("'\\u3002\\uFF1B';");
	// 	expect(wordsUtils.unescape4escodegen(code)).to.be("'。；';");
	// });
});

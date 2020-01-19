'use strict';

const expect = require('expect.js');
const escodegen = require('escodegen');
const parser = require('../lib/parser');
const i18nGenerator = require('../lib/generator');

describe('#parser', function() {
	it('#base', function() {
		const astData = {
			word_1: '文字_1',
			word_3: '文字_3',
			word_2: '文字_2',
			word_empty1: [],
			word_empty2: ''
		};

		const resultAst = i18nGenerator._wordJson2ast(astData);
		const astJson = JSON.parse(
			escodegen.generate(resultAst, { format: { quotes: 'double' } })
		);
		expect(astJson).to.eql({
			word_1: '文字_1',
			word_2: '文字_2',
			word_3: '文字_3',
			word_empty1: [],
			word_empty2: []
		});
		expect(Object.keys(astJson)).to.eql([
			'word_1',
			'word_2',
			'word_3',
			'word_empty1',
			'word_empty2'
		]);

		const resultJson = parser._wordAst2json(resultAst);
		expect(resultJson).to.eql({
			word_1: '文字_1',
			word_2: '文字_2',
			word_3: '文字_3',
			word_empty1: '',
			word_empty2: ''
		});
		expect(Object.keys(resultJson)).to.eql([
			'word_1',
			'word_2',
			'word_3',
			'word_empty1',
			'word_empty2'
		]);
	});
});

'use strict';

const expect = require('expect.js');
const astUtil = require('i18nc-ast').util;
const testReq = require('i18nc-test-req');
const i18nGenerator = require('../lib/generator');
const requireAfterWrite = testReq('generator');
testReq.ROOT_PATH = __dirname + '/output';

describe('#generator', function() {
	it('#toTranslateJSON', function() {
		const data = require('./input.json');
		const result = i18nGenerator.toTranslateJSON(data);
		const outputJSON = requireAfterWrite('func_json.json', result);

		expect(result).to.eql(outputJSON);
	});

	it('#translateJSON2ast', function() {
		const data = require('./output/generator/func_json.json');
		const resultAst = i18nGenerator._translateJSON2ast(data);
		const resultCode = 'var json = ' + astUtil.tocode(resultAst);

		const otherCode = requireAfterWrite('func_json.js', resultCode);

		expect(testReq.code2arr(resultCode)).to.eql(
			testReq.code2arr(otherCode)
		);
	});

	describe('#wordJson2ast', function() {
		describe('#comments', function() {
			it('#empty', function() {
				const astData = {
					'中文_1': null,
					'中文_2': null,
					'中文_3': null
				};
				function code() {
					const d = {
						// '中文_1':
						// '中文_2':
						// '中文_3':
						'': null
					};
					console.log(d);
				}
				const resultAst = i18nGenerator._wordJson2ast(astData);
				const resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code));
			});

			it('#first', function() {
				const astData = {
					'中文_1': null,
					'中文_2': null,
					'中文_3': ['word_3']
				};
				function code() {
					const d = {
						// '中文_1':
						// '中文_2':
						'中文_3': ['word_3']
					};
					console.log(d);
				}
				const resultAst = i18nGenerator._wordJson2ast(astData);
				const resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code));
			});

			it('#middle', function() {
				const astData = {
					'中文_1': null,
					'中文_2': ['word_2'],
					'中文_3': null
				};
				function code() {
					const d = {
						// '中文_1':
						// '中文_3':
						'中文_2': ['word_2']
					};
					console.log(d);
				}
				const resultAst = i18nGenerator._wordJson2ast(astData);
				const resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code));
			});

			it('#last', function() {
				const astData = {
					'中文_1': null,
					'中文_2': null,
					'中文_3': ['word_3']
				};
				function code() {
					const d = {
						// '中文_1':
						// '中文_2':
						'中文_3': ['word_3']
					};
					console.log(d);
				}
				const resultAst = i18nGenerator._wordJson2ast(astData);
				const resultCode = astUtil.tocode(resultAst);
				expect(code2arr(resultCode)).to.eql(func2codeArr(code));
			});
		});
	});
});

function code2arr(code) {
	return code.split(/\n\r?\t*/).filter(function(val) {
		return val;
	});
}

function func2codeArr(func) {
	const code = func.toString().split(/\{|\};?/);
	return code2arr(['{', code[2], '}'].join(''));
}

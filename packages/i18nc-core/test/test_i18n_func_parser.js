'use strict';

const expect = require('expect.js');
const esprima = require('esprima');
const i18nParser = require('../lib/i18n_func/parser');
const requireAfterWrite = require('./auto_test_utils').requireAfterWrite(
	'i18n_func_parser'
);

describe('#i18n_func_parser', function() {
	it('#base', function() {
		const code = require('./files/casefile/i18n_handler/i18n_handler_example').toString();
		const ast = esprima.parse(code);
		const result = i18nParser.parse(ast.body[0]);
		const outputJSON = requireAfterWrite(
			'i18n_handler_example_output.json',
			result
		);
		expect(result).to.eql(outputJSON);
	});

	it('#old', function() {
		const code = require('./files/casefile/i18n_handler/i18n_handler_example_v1').toString();
		const ast = esprima.parse(code);
		const result = i18nParser.parse(ast.body[0]);
		const outputJSON = requireAfterWrite(
			'i18n_handler_example_v1_output.json',
			result
		);
		expect(result).to.eql(outputJSON);
	});

	describe('#globalHandlerName', function() {
		it('#base', function() {
			const code = require('./files/casefile/i18n_handler/i18n_handler_global_example').toString();
			const ast = esprima.parse(code);
			const result = i18nParser.parse(ast.body[0]);
			const outputJSON = requireAfterWrite(
				'i18n_handler_global_example_output.json',
				result
			);
			expect(result).to.eql(outputJSON);
			expect(result.globalHandlerName).to.be('I18N.topI18N');
		});

		it('#dev code', function() {
			const code = require('./files/casefile/i18n_handler/i18n_handler_global_dev').toString();
			const ast = esprima.parse(code);
			const result = i18nParser.parse(ast.body[0]);
			const outputJSON = requireAfterWrite(
				'i18n_handler_global_dev_output.json',
				result
			);
			expect(result).to.eql(outputJSON);
			expect(result.globalHandlerName).to.be('window.topI18N');
		});
	});

	describe('#fullHanlder', function() {
		it('#base', function() {
			const code = require('./files/casefile/i18n_handler/i18n_handler_fullhandler').toString();
			const ast = esprima.parse(code);
			const result = i18nParser.parse(ast.body[0]);
			const outputJSON = requireAfterWrite(
				'i18n_handler_fullhandler_output.json',
				result
			);
			expect(result).to.eql(outputJSON);
			expect(result.codeStyle).to.be('fullHandler');
		});
	});

	describe('#mulit VKD', function() {
		const i18ncVirtual = require('./files/casefile/i18n_handler/i18n_handler_virtual');

		it('#simple', function() {
			const ast = esprima.parse(i18ncVirtual.simple.toString());
			const result = i18nParser.parse(ast.body[0]);
			expect(result.handlerName).to.be('I18N');
			expect(result.handlerNameVarName).to.be('a');
			expect(result.__FUNCTION_VERSION__).to.be('8');
		});

		function addCase(name) {
			it('#' + name, function() {
				const ast = esprima.parse(i18ncVirtual[name].toString());
				const result = i18nParser.parse(ast.body[0]);
				expect(result.handlerName).to.be('I18N');
				expect(result.handlerNameVarName).to.be('a');
				expect(result.__FUNCTION_VERSION__).to.be(undefined);
			});
		}

		addCase('nothandler');
		addCase('otherscope');
		addCase('otherscope2');
		addCase('otherscope3');
	});
});

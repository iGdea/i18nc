'use strict';

var expect				= require('expect.js');
var esprima				= require('esprima');
var i18nParser			= require('../../lib/i18n_func/parser');
var requireAfterWrite	= require('../auto_test_utils').requireAfterWrite('i18n_func_parser');

describe('#i18n_func_parser', function()
{
	it('#base', function()
	{
		var code = require('../files/casefile/i18n_handler/i18n_handler_example').toString();
		var ast = esprima.parse(code);
		var result = i18nParser.parse(ast.body[0]);
		var outputJSON = requireAfterWrite('i18n_handler_example_output.json', result);
		expect(result).to.eql(outputJSON);
	});

	it('#old', function()
	{
		var code = require('../files/casefile/i18n_handler/i18n_handler_example_old').toString();
		var ast = esprima.parse(code);
		var result = i18nParser.parse(ast.body[0]);
		var outputJSON = requireAfterWrite('i18n_handler_example_old_output.json', result);
		expect(result).to.eql(outputJSON);
	});

	describe('#globalHandlerName', function()
	{
		it('#base', function()
		{
			var code = require('../files/casefile/i18n_handler/i18n_handler_global_example').toString();
			var ast = esprima.parse(code);
			var result = i18nParser.parse(ast.body[0]);
			var outputJSON = requireAfterWrite('i18n_handler_global_example_output.json', result);
			expect(result).to.eql(outputJSON);
			expect(result.globalHandlerName).to.be('I18N.topI18N');
		});

		it('#dev code', function()
		{
			var code = require('../files/casefile/i18n_handler/i18n_handler_global_dev').toString();
			var ast = esprima.parse(code);
			var result = i18nParser.parse(ast.body[0]);
			var outputJSON = requireAfterWrite('i18n_handler_global_dev_output.json', result);
			expect(result).to.eql(outputJSON);
			expect(result.globalHandlerName).to.be('window.topI18N');
		});
	});

	describe('#mulit VKD', function()
	{
		var i18ncVirtual = require('../files/casefile/i18n_handler/i18n_handler_virtual');

		it('#simple', function()
		{
			var ast = esprima.parse(i18ncVirtual.simple.toString());
			var result = i18nParser.parse(ast.body[0]);
			expect(result.handlerName).to.be('I18N');
			expect(result.handlerNameVarName).to.be('a');
			expect(result.__FUNCTION_VERSION__).to.be('8');
		});

		function addCase(name)
		{
			it('#'+name, function()
			{
				var ast = esprima.parse(i18ncVirtual[name].toString());
				var result = i18nParser.parse(ast.body[0]);
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

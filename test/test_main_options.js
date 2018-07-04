'use strict';

var expect				= require('expect.js');
var i18nc				= require('../');
var dbTranslateWords	= require('./example/translate_words_db');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('main_options');
var collectFuncs		= require('./files/casefile/func_code/func_code_collect');

describe('#main_options', function()
{
	describe('#ignoreScanHandlerNames', function()
	{
		it('#ignore simple callee', function()
		{
			var info = i18nc('somefunc("中文")', {ignoreScanHandlerNames: ['somefunc']});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();
		});

		it('#ignore MemberExpression callee', function()
		{
			var info = i18nc('obj.log("中文")', {ignoreScanHandlerNames: ['obj.log']});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();

			var info = i18nc('obj.obj.log("中文")', {ignoreScanHandlerNames: ['obj.obj.log']});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();
		});

		it('#ignore define', function()
		{
			var info = i18nc('function somefunc(){println("中文")}', {ignoreScanHandlerNames: ['somefunc']});
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.be.empty();
		});
	});


	it('#cutword', function()
	{
		var code = collectFuncs.no_words;

		var info = i18nc(code.toString(),
			{
				cutword: function(emitData)
				{
					emitData.result =
					[
						{
							translateWord: true,
							value: emitData.originalString
						}
					];
				}
			});

		var otherCode = requireAfterWrite('func_code_cutword_output.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	it('#isInjectAllTranslateWords', function()
	{
		var code = collectFuncs.has_words;
		var info = i18nc(code.toString(),
			{
				isInjectAllTranslateWords: false
			});

		var otherCode = requireAfterWrite('func_code_no_notused_words_output.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	describe('#codeModifiedArea', function()
	{
		var exampleCode = 'module.exports = '+require('./example/func_code.js').toString();

		it('#only I18NHandler', function()
		{
			var info = i18nc(exampleCode,
			{
				codeModifiedArea: ['I18NHandler'],
				dbTranslateWords: dbTranslateWords,
			});

			var outputJSON = requireAfterWrite('func_code_codeModifiedArea1_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('func_code_codeModifiedArea1_output.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});

		it('#only translateWord', function()
		{
			var info = i18nc(exampleCode,
			{
				codeModifiedArea: ['TranslateWord'],
				dbTranslateWords: dbTranslateWords,
			});

			var outputJSON = requireAfterWrite('func_code_codeModifiedArea2_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('func_code_codeModifiedArea2_output.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});

		it('#no regexp', function()
		{
			var info = i18nc('var dd = /中文/;',
			{
				codeModifiedArea: []
			});
			expect(info.code).to.be('var dd = /中文/;');
		});

		it('#empty', function()
		{
			var info = i18nc(exampleCode,
			{
				codeModifiedArea: [],
				dbTranslateWords: dbTranslateWords,
			});

			var outputJSON = requireAfterWrite('func_code_codeModifiedArea3_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('func_code_codeModifiedArea3_output.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});
	});


	describe('#isMinFuncTranslateCode', function()
	{
		it('#base', function()
		{
			var code = collectFuncs.has_words;
			var info = i18nc(code.toString(),
				{
					isMinFuncTranslateCode: true
				});

			var otherCode = requireAfterWrite('func_code_min_i18n_output_base.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#wdithdb', function()
		{
			var code = collectFuncs.has_words;
			var info = i18nc(code.toString(),
				{
					dbTranslateWords: dbTranslateWords,
					isMinFuncTranslateCode: true
				});

			var otherCode = requireAfterWrite('func_code_min_i18n_output_widthdb.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#partialUpdate', function()
		{
			var code = require('./files/casefile/i18n_handler/i18n_handler_example.js');
			var funcInfo = require('./files/casefile/i18n_handler/i18n_handler_example_output.json');
			var codeData =
			{
				DEFAULTS: Object.keys(funcInfo.__TRANSLATE_JSON__['en-US'].DEFAULTS),
			};

			codeData = '\nvar codeJSON='+JSON.stringify(codeData, null, '\t');
			// println(codeData);

			var info = i18nc(code.toString()+codeData,
				{
					dbTranslateWords: dbTranslateWords,
					isMinFuncTranslateCode: true
				});

			var otherCode = requireAfterWrite('func_code_min_i18n_output_partiaupdate.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

	});


	it('#pickFileLanguages', function()
	{
		var code = 'println("不可能存在的中文翻译词组");';
		var info = i18nc(code,
			{
				isCheckClosureForNewI18NHandler: false,
				pickFileLanguages: ['en-US']
			});

		var otherCode = requireAfterWrite('func_code_no_db_set_lans.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});


	it('#isInsertI18NHandler', function()
	{
		var info = i18nc('var a = "中文"', {codeModifiedArea: {I18NHandler: false}});

		var otherCode = requireAfterWrite('func_code_no_insert_i18n_hanlder.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});

	describe('#isCheckClosureForNewI18NHandler', function()
	{
		describe('#closure', function()
		{
			var code = 'function code(){var words = "中文"}';

			it('#use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: true});
				var otherCode = requireAfterWrite('func_code_closure_closure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});
				var otherCode = requireAfterWrite('func_code_closure_noclosure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});
		});

		describe('#noclosure', function()
		{
			var code = 'var words = "中文"';

			it('#use', function()
			{
				expect(function()
					{
						i18nc(code, {isCheckClosureForNewI18NHandler: true});
					})
					.to.throwError(/closure youself/);
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});
				var otherCode = requireAfterWrite('func_code_noclosure_noclosure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});
		});


		// 没有处理前，会报closure myself错误
		describe('#FunctionExpression closure', function()
		{
			var code = '(function(){var words = "中文"})();';

			it('#use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: true});
				var otherCode = requireAfterWrite('func_code_closure_funcexp_closure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});
				var otherCode = requireAfterWrite('func_code_closure_funcexp_noclosure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});
		});
	});

	it('#isIgnoreI18NHandlerTranslateWords', function()
	{
		var code = require('./example/func_code_output').toString();
		var info = i18nc(code,
			{
				isIgnoreI18NHandlerTranslateWords: true,
				dbTranslateWords:
				{
					'zh-TW': {
						'*': {DEFAULTS: {'简体': '簡體'}}
					}
				}
			});
		var otherCode = requireAfterWrite('func_code_ignore_func_words.js', info.code, {readMode: 'string'});
		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});

	describe('#proxyGlobalHandler', function()
	{
		it('#isProxyGlobalHandler', function()
		{
			var code = require('./files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(code,
				{
					isProxyGlobalHandler: true,
				});
			var otherCode = requireAfterWrite('func_code_noi18n_proxy_global.js', info.code, {readMode: 'string'});
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});

		it('#isIgnoreCodeProxyGlobalHandlerName', function()
		{
			var code = require('./files/casefile/func_code/func_code_i18n_global_handler').toString();
			var info = i18nc(code,
				{
					isProxyGlobalHandler: true,
					isIgnoreCodeProxyGlobalHandlerName: true,
					proxyGlobalHandlerName: 'topI18N2'
				});
			var otherCode = requireAfterWrite('func_code_i18n_global_handler_ignore_code.js', info.code, {readMode: 'string'});
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});
	});


});

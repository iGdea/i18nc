'use strict';

var expect				= require('expect.js');
var i18nc				= require('../../');
var dbTranslateWords	= require('../example/translate_words_db');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('main_options');
var collectFuncs		= require('../files/casefile/func_code/func_code_collect');

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

		var otherCode = requireAfterWrite('func_code_cutword_output.js', info.code);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	it('#isInjectAllTranslateWords', function()
	{
		var code = collectFuncs.has_words;
		var info = i18nc(code.toString(),
			{
				isInjectAllTranslateWords: false
			});

		var otherCode = requireAfterWrite('func_code_no_notused_words_output.js', info.code);
		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});

	it('#depdEnable', function()
	{
		var info = i18nc('var dd = "中文"',
			{
				cutWordReg: /词典/g,
				I18NHandler: {insert: {checkClosure: false}},
				depdEnable: false
			});

		var otherCode = requireAfterWrite('func_code_no_depdenable_output.js', info.code);
		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});

	describe('#I18NHandler', function()
	{
		describe('#upgrade', function()
		{
			it('#enable', function()
			{
				var exampleCode = require('../example/func_code.js').toString();
				var info = i18nc(exampleCode,
				{
					I18NHandler:
					{
						upgrade: {enable: false}
					},
					dbTranslateWords: dbTranslateWords,
				});

				var otherCode = requireAfterWrite('func_code_upgrade_disable.js', info.code);
				var outputJSON = requireAfterWrite('func_code_upgrade_disable.json', autoTestUtils.JsonOfI18ncRet(info));
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
				expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			});

			it('#updateJSON', function()
			{
				var code = require('../files/casefile/i18n_handler/i18n_handler_example').toString();
				var info = i18nc(code,
				{
					I18NHandler:
					{
						upgrade: {updateJSON: false}
					},
					dbTranslateWords: dbTranslateWords,
				});

				var otherCode = requireAfterWrite('func_code_upgrade_updatejson.js', info.code);
				var outputJSON = requireAfterWrite('func_code_upgrade_updatejson.json', autoTestUtils.JsonOfI18ncRet(info));
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
				expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			});
		});

		describe('#insert', function()
		{
			it('#enable', function()
			{
				var info = i18nc('var dd = "中文"',
				{
					I18NHandler: {insert: {enable: false}},
				});

				var otherCode = requireAfterWrite('func_code_insert_disable.js', info.code);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});
		});
	});


	describe('#codeModifiedArea', function()
	{
		var exampleCode = require('../example/func_code.js').toString();

		it('#only translateWord', function()
		{
			var info = i18nc(exampleCode,
			{
				codeModifiedArea: ['TranslateWord'],
				dbTranslateWords: dbTranslateWords,
			});

			var otherCode = requireAfterWrite('func_code_codeModifiedArea2_output.js', info.code);
			var outputJSON = requireAfterWrite('func_code_codeModifiedArea2_output.json', autoTestUtils.JsonOfI18ncRet(info));
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
		});

		it('#no regexp', function()
		{
			var code = 'var dd = /中文/;'
			var info = i18nc(code,
			{
				codeModifiedArea: []
			});
			expect(info.code).to.be('var dd = /中文/;');

			var info2 = i18nc(code,
			{
				isCheckClosureForNewI18NHandler: false,
				codeModifiedArea:
				{
					I18NHandler: false,
					TranslateWord_RegExp: true
				}
			});
			expect(info2.code).to.be("var dd = new RegExp(I18N('中文'));");
		});

		it('#empty', function()
		{
			var info = i18nc(exampleCode,
			{
				codeModifiedArea: [],
				dbTranslateWords: dbTranslateWords,
			});

			var otherCode = requireAfterWrite('func_code_codeModifiedArea3_output.js', info.code);
			var outputJSON = requireAfterWrite('func_code_codeModifiedArea3_output.json', autoTestUtils.JsonOfI18ncRet(info));
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
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

		var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
		var otherCode = requireAfterWrite('func_code_no_db_set_lans.js', wrapCode);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	it('#isInsertI18NHandler', function()
	{
		var info = i18nc('var a = "中文"', {codeModifiedArea: {I18NHandler: false}});

		var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
		var otherCode = requireAfterWrite('func_code_no_insert_i18n_hanlder.js', wrapCode);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});

	describe('#isCheckClosureForNewI18NHandler', function()
	{
		describe('#closure', function()
		{
			var code = 'function code(){var words = "中文"}';

			it('#use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: true});
				var otherCode = requireAfterWrite('func_code_closure_closure.js', info.code);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});
				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_closure_noclosure.js', wrapCode);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
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
					.to.throwError(/closure by youself/);
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});
				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_noclosure_noclosure.js', wrapCode);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});
		});


		// 没有处理前，会报closure myself错误
		describe('#FunctionExpression closure', function()
		{
			var code = '(function(){var words = "中文"})();';

			it('#use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: true});
				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_closure_funcexp_closure.js', wrapCode);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});
				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_closure_funcexp_noclosure.js', wrapCode);
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});
		});
	});

	it('#isIgnoreI18NHandlerTranslateWords', function()
	{
		var code = require('../example/func_code_output').toString();
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
		var otherCode = requireAfterWrite('func_code_ignore_func_words.js', info.code);
		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});

	describe('#proxyGlobalHandler', function()
	{
		var code = require('../files/casefile/func_code/func_code_i18n_global_handler').toString();

		it('#isProxyGlobalHandler', function()
		{
			var code = require('../files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(code,
				{
					isProxyGlobalHandler: true,
				});
			var otherCode = requireAfterWrite('func_code_noi18n_proxy_global.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#isProxyGlobalHandler', function()
		{
			var info = i18nc(code,
				{
					isProxyGlobalHandler: true,
				});
			var otherCode = requireAfterWrite('func_code_noi18n_proxy_global_auto_convert.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#isIgnoreCodeProxyGlobalHandlerName', function()
		{
			var info = i18nc(code,
				{
					isProxyGlobalHandler: true,
					isIgnoreCodeProxyGlobalHandlerName: true,
					proxyGlobalHandlerName: 'topI18N2'
				});
			var otherCode = requireAfterWrite('func_code_i18n_global_handler_ignore_code.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#no autoConvert', function()
		{
			var info = i18nc(code,
				{
					I18NHandler:
					{
						style:
						{
							proxyGlobalHandler:
							{
								enable: false,
								autoConvert: false,
							}
						}
					}
				});
			var otherCode = requireAfterWrite('func_code_i18n_global_handler_no_auto_convert.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});


	describe('#fullHandler', function()
	{
		var code = require('../files/casefile/func_code/func_code_i18n_full_handler').toString();

		it('#autoConvert', function()
		{
			var info = i18nc(code,
				{
					I18NHandler:
					{
						style:
						{
							codeStyle: 'proxyGlobalHandler',
							fullHandler:
							{
								autoConvert: true,
							}
						}
					}
				});
			var otherCode = requireAfterWrite('func_code_i18n_full_handler_auto_convert.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#no autoConvert', function()
		{
			var info = i18nc(code,
				{
					I18NHandler:
					{
						style:
						{
							codeStyle: 'proxyGlobalHandler',
							fullHandler:
							{
								autoConvert: false,
							}
						}
					}
				});
			var otherCode = requireAfterWrite('func_code_i18n_full_handler_no_auto_convert.js', info.code);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});


});

var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var dbTranslateWords	= require('./example/translate_words_db');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('output_main_options');


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

	it('#comboLiteralMode', function()
	{
		var code = require('./files/casefile_main/func_code_combo_literal');
		var info = i18nc(code.toString(), {comboLiteralMode: 'I18N'});

		var otherCode = requireAfterWrite('func_code_combo_literal_output.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	it('#cutword', function()
	{
		var code = function code()
		{
			var v1 = '1234';
		};

		var info = i18nc(code.toString(),
			{
				cutword: function(emitData)
				{
					emitData.lineStrings =
					[
						{
							translateWord: true,
							value: emitData.value
						}
					];
				}
			});

		var otherCode = requireAfterWrite('func_code_cutword_output.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	it('#isInjectAllTranslateWords', function()
	{
		var code = function code()
		{
			var v1 = '简体';
		};

		var info = i18nc(code.toString(),
			{
				isInjectAllTranslateWords: false
			});

		var otherCode = requireAfterWrite('func_code_no_notused_words_output.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
	});


	describe('#codeModifiedArea', function()
	{
		var exampleCode = fs.readFileSync(__dirname+'/example/func_code.js').toString();

		it('#only i18nHanlder', function()
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
				codeModifiedArea: {I18NHandler: false},
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
			var code = function code()
			{
				var v1 = '简体';
			};

			var info = i18nc(code.toString(),
				{
					isMinFuncTranslateCode: true
				});

			var otherCode = requireAfterWrite('func_code_min_i18n_output_base.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#wdithdb', function()
		{
			var code = function code()
			{
				var v1 = '简体';
			};

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
			var code = require('./files/i18n_handler_example.js');
			var funcInfo = require('./files/i18n_handler_example_output.json');
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
				isClosureWhenInsertedHead: false,
				pickFileLanguages: ['en-US']
			});

		var otherCode = requireAfterWrite('func_code_no_db_set_lans.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});


	describe('#cutwordBeautify', function()
	{
		describe('#RemoveTplComment', function()
		{
			var code = require('./files/casefile_main/func_code_tpl_comment').toString();

			it('#remove', function()
			{
				var info = i18nc(code,
					{
						cutWordBeautify: ['RemoveTplComment']
					});

				var otherCode = requireAfterWrite('func_code_tpl_comment_remove.js', info.code, {readMode: 'string'});

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});

			it('#keep', function()
			{
				var info = i18nc(code,
					{
						cutWordBeautify: []
					});

				var otherCode = requireAfterWrite('func_code_tpl_comment_keep.js', info.code, {readMode: 'string'});

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});


			it('#nokey', function()
			{
				var code = require('./files/casefile_main/func_code_tpl_comment_nokey').toString();
				var info = i18nc(code,
					{
						cutWordBeautify: ['RemoveTplComment']
					});

				var otherCode = requireAfterWrite('func_code_tpl_comment_nokey.js', info.code, {readMode: 'string'});

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});
		});
	});


	it('#isInsertI18NHandler', function()
	{
		var info = i18nc('var a = "中文"', {codeModifiedArea: {I18NHandler: false}});

		var otherCode = requireAfterWrite('func_code_no_insert_i18n_hanlder.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});

	describe('#isClosureWhenInsertedHead', function()
	{
		var code1 = 'var words = "中文"';

		describe('#closure', function()
		{
			var code = 'function code(){var words = "中文"}';

			it('#use', function()
			{
				var info = i18nc(code, {isClosureWhenInsertedHead: true});
				var otherCode = requireAfterWrite('func_code_closure_closure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isClosureWhenInsertedHead: false});
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
						i18nc(code, {isClosureWhenInsertedHead: true});
					})
					.to.throwError(/closure youself/);
			});

			it('#no use', function()
			{
				var info = i18nc(code, {isClosureWhenInsertedHead: false});
				var otherCode = requireAfterWrite('func_code_noclosure_noclosure.js', info.code, {readMode: 'string'});
				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
			});
		});
	});
});

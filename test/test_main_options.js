var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var dbTranslateWords	= require('./example/translate_words_db');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('output_main_options');


describe('#main_options', function()
{
	it('#ignoreScanHandlerNames', function()
	{
		var code = function code()
		{
			function somefunc()
			{
				console.log('中文 in some func');
			}

			somefunc('中文 run some func');

			function otherfunc()
			{
				console.log('中文 in other func');
			}

			otherfunc('中文 run other func');
		};

		var info = i18nc(code.toString(), {ignoreScanHandlerNames: ['somefunc']});

		expect(autoTestUtils.getCodeTranslateAllWords(info))
			.to.eql(['中文 in other func', '中文 run other func'].sort());
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
					expect(emitData.lineStrings).to.empty();
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
				ignoreScanError: ['ObjectKey'],
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
				codeModifiedArea: ['translateWord'],
				dbTranslateWords: dbTranslateWords,
				ignoreScanError: ['ObjectKey'],
			});

			var outputJSON = requireAfterWrite('func_code_codeModifiedArea2_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('func_code_codeModifiedArea2_output.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});

		it('#empty', function()
		{
			var info = i18nc(exampleCode,
			{
				codeModifiedArea: [],
				dbTranslateWords: dbTranslateWords,
				ignoreScanError: ['ObjectKey'],
			});

			var outputJSON = requireAfterWrite('func_code_codeModifiedArea3_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('func_code_codeModifiedArea3_output.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
		});
	});


	describe('#isMinI18Nhanlder', function()
	{
		it('#base', function()
		{
			var code = function code()
			{
				var v1 = '简体';
			};

			var info = i18nc(code.toString(),
				{
					isMinI18Nhanlder: true
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
					isMinI18Nhanlder: true
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
			// console.log(codeData);

			var info = i18nc(code.toString()+codeData,
				{
					dbTranslateWords: dbTranslateWords,
					isMinI18Nhanlder: true
				});

			var otherCode = requireAfterWrite('func_code_min_i18n_output_partiaupdate.js', info.code, {readMode: 'string'});

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

	});


	it('#pickFileLanguages', function()
	{
		var code = 'console.log("不可能存在的中文翻译词组");';
		var info = i18nc(code,
			{
				pickFileLanguages: ['en-US']
			});

		var otherCode = requireAfterWrite('func_code_no_db_set_lans.js', info.code, {readMode: 'string'});

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});

});

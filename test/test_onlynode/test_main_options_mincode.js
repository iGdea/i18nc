/*
 * safari foxmail min出来的模版变量和v8的结果不同
 * 所以不能用v8的结果去匹配，所以不在浏览器环境下跑测试用例
 * 但功能没有问题
 */


'use strict';

var expect				= require('expect.js');
var i18nc				= require('../../');
var dbTranslateWords	= require('../example/translate_words_db');
var autoTestUtils		= require('../auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('onlynode/main_options_mincode');
var collectFuncs		= require('../files/casefile/func_code/func_code_collect');


describe('#main_options_mincode', function()
{
	function test(name)
	{
		describe(name, function()
		{
			var filename = 'func_code_i18n_min_'+name.toLowerCase()+'_output';

			it('#base', function()
			{
				var code = collectFuncs.has_words;
				var info = i18nc(code.toString(),
					{
						minTranslateFuncCode: name
					});

				var otherCode = requireAfterWrite(filename+'_base.js', info.code);

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			it('#wdithdb', function()
			{
				var code = collectFuncs.has_words;
				var info = i18nc(code.toString(),
					{
						dbTranslateWords: dbTranslateWords,
						minTranslateFuncCode: name
					});

				var otherCode = requireAfterWrite(filename+'_widthdb.js', info.code);

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			it('#partialUpdate', function()
			{
				var code = require('../files/casefile/i18n_handler/i18n_handler_example.js');
				var funcInfo = require('../files/casefile/i18n_handler/i18n_handler_example_output.json');
				var codeData =
				{
					DEFAULTS: Object.keys(funcInfo.__TRANSLATE_JSON__['en-US'].DEFAULTS),
				};

				codeData = '\nvar codeJSON='+JSON.stringify(codeData, null, '\t');
				// println(codeData);

				var info = i18nc(code.toString()+codeData,
					{
						dbTranslateWords: dbTranslateWords,
						minTranslateFuncCode: name
					});
				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite(filename+'_partiaupdate.js', wrapCode);

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});
		});
	}

	test('all');
	test('onlyFunc');

});

'use strict';

var expect				= require('expect.js');
var i18nc				= require('../');
var DEF					= require('../lib/def');
var dbTranslateWords	= require('./example/translate_words_db');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('main');

describe('#main', function()
{
	describe('#widthdb funcData', function()
	{
		var exampleCode = require('./files/casefile/i18n_handler/i18n_handler_example.js');
		exampleCode = exampleCode.toString();

		it('#nocode', function()
		{
			var info = i18nc(exampleCode,
			{
				dbTranslateWords: dbTranslateWords
			});

			var outputJSON = requireAfterWrite('i18n_handler_example_i18nc_nocode_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('i18n_handler_example_i18nc_nocode_output.js', info.code);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#withcode', function()
		{
			var funcInfo = require('./files/casefile/i18n_handler/i18n_handler_example_output.json');
			var codeData =
			{
				DEFAULTS: Object.keys(funcInfo.__TRANSLATE_JSON__['en-US'].DEFAULTS),
				SUBTYPES:
				{
					subtype: Object.keys(funcInfo.__TRANSLATE_JSON__['en-US'].SUBTYPES.subtype)
				}
			};

			codeData = '\nvar codeJSON = '+JSON.stringify(codeData, null, '\t');

			var info = i18nc(exampleCode+codeData,
			{
				dbTranslateWords: dbTranslateWords
			});

			var outputJSON = requireAfterWrite('i18n_handler_example_i18nc_withcode_output.json', autoTestUtils.JsonOfI18ncRet(info));
			var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
			var otherCode = requireAfterWrite('i18n_handler_example_i18nc_withcode_output.js', wrapCode);

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});


	describe('#insert when noi18n', function()
	{
		it('#noI18N', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_noi18n_output.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#noI18N noclosure', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_noi18n').toString();
			var info = i18nc(exampleCode, {isCheckClosureForNewI18NHandler: false});

			var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
			var otherCode = requireAfterWrite('func_code_noi18n_output_noclosure.js', wrapCode);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#define', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_i18n_define').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_i18n_define_output.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#define not_define', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_i18n_define').toString();
			var info = i18nc(exampleCode,
				{
					isInsertToDefineHalder: false
				});

			var otherCode = requireAfterWrite('func_code_i18n_define_output_notdefine.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});

	describe('#simple i18n', function()
	{
		it('#one i18n', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_i18n').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_i18n_output.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#define and scope', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_i18n_define').toString();
			var info = i18nc(exampleCode,
				{
					dbTranslateWords:
					{
						zh:
						{
							'*':
							{
								DEFAULTS:
								{
									'global 中文1': 'global 中文1',
									'define1 中文': 'define1 中文',
									'define2 中文': 'define2 中文',
									'global 中文2': 'global 中文2'
								}
							}
						}
					}
				});

			var otherCode = requireAfterWrite('func_code_i18n_define_output_words.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});


		it('#no words', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_i18n_nowords').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_i18n_nowords_output.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});

	describe('#global i18n', function()
	{
		it('#new code', function()
		{
			var exampleCode = require('./files/casefile/func_code/func_code_i18n_global_handler').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_i18n_global_handler_output.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});

	describe('#dbTranslate', function()
	{
		describe('#no db', function()
		{
			var code = 'println("不可能存在的中文翻译词组");';

			it('#noanything', function()
			{
				var info = i18nc(code, {isCheckClosureForNewI18NHandler: false});

				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_no_db.js', wrapCode);

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			it('#only lan', function()
			{
				var info = i18nc(code,
					{
						isCheckClosureForNewI18NHandler: false,
						dbTranslateWords:
						{
							en:
							{
								'*': {DEFAULTS:{}}
							}
						}
					});

				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_no_db_only_lan.js', wrapCode);

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});

			it('#other_db', function()
			{
				var info = i18nc(code,
					{
						isCheckClosureForNewI18NHandler: false,
						dbTranslateWords:
						{
							en:
							{
								'*': {DEFAULTS: {'嘿嘿': 'hihi'}}
							}
						}
					});

				var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
				var otherCode = requireAfterWrite('func_code_no_db_other_db.js', wrapCode);

				expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
			});
		});

		it('#use default lan', function()
		{
			var code = function code()
			{
				println("不可能存在的中文翻译词组");
				function I18N()
				{
					var self = I18N;
					self.__FILE_KEY__ = "default_file_key";
					self.__FUNCTION_VERSION__ = "$FUNCTION_VERSION$";
					self.__TRANSLATE_JSON__ =
					{
						en: {DEFAULTS:{'1':'2'}}
					};
				}
			};
			code = code.toString().replace(/\$FUNCTION_VERSION\$/, DEF.I18NFunctionVersion);
			var info = i18nc(code);
			var otherCode = requireAfterWrite('func_code_default_lan.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#update lan by db', function()
		{
			var code = function code()
			{
				println("简体");
				function I18N()
				{
					var self = I18N;
					self.__FILE_KEY__ = "default_file_key";
					self.__FUNCTION_VERSION__ = "$FUNCTION_VERSION$";
					self.__TRANSLATE_JSON__ =
					{
						'en': {DEFAULTS:{'1':'2'}}
					};
				}
			};
			code = code.toString().replace(/\$FUNCTION_VERSION\$/, DEF.I18NFunctionVersion);
			var info = i18nc(code,
				{
					dbTranslateWords:
					{
						'zh-TW':
						{
							'*': {DEFAULTS: {'简体': '簡體'}}
						}
					}
				});
			var otherCode = requireAfterWrite('func_code_update_by_db.js', info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});

	describe('#core style', function()
	{
		it('#width head / end', function()
		{
			var info = i18nc('/* begin */\ndefine(function(){println("中文")})\n/* end */\n');

			var wrapCode = autoTestUtils.wrapCode4pkg(info.code);
			var otherCode = requireAfterWrite('func_code_head_has_content_output.js', wrapCode);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});

	describe('#special chars', function()
	{
		it('#\\n\\r', function()
		{
			var info = i18nc('function a(){println("\\n\\r"); println("\\n")}',
				{
					cutwordReg: /\s+/,
					dbTranslateWords:
					{
						'en-US':
						{
							'*': {DEFAULTS: {'\n': 'new line\n'}}
						}
					}
				});
			var otherCode = requireAfterWrite('func_code_special_chars1.js', info.code);
			eval(info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#\\u2029', function()
		{
			var info = i18nc('function a(){println("\\u2029\\u2029"); println("\\u2029")}',
				{
					cutwordReg: /\u2029+/,
					dbTranslateWords:
					{
						'en-US':
						{
							'*': {DEFAULTS: {'\u2029': 'new line\u2029'}}
						}
					}
				});
			var otherCode = requireAfterWrite('func_code_special_chars2.js', info.code);
			eval(info.code);

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});


	describe('#result', function()
	{
		describe('#dirtyWords', function()
		{
			it('#ObjectKey', function()
			{
				var code = function code()
				{
					var v1 =
					{
						"中文key": "中文val"
					};
				};

				var info = i18nc(code.toString());

				expect(info.allDirtyWords().toArray()).to.eql(["'中文key'"]);
			});
		});
	});


});

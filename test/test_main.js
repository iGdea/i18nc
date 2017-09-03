var _					= require('lodash');
var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var dbTranslateWords	= require('./example/translate_words_db');
var requireAfterWrite	= require('./auto_test_utils').requireAfterWrite();

describe('#i18nc', function()
{
	describe('#widthdb funcData', function()
	{
		var exampleCode = require('./files/i18n_handler_example.js');
		exampleCode = 'module.exports = I18N;\n'+exampleCode.toString();

		it('#nocode', function()
		{
			var info = i18nc(exampleCode,
			{
				dbTranslateWords: dbTranslateWords
			});

			var outputJSON = requireAfterWrite('i18n_handler_example_i18nc_nocode_output.json', getOutputJSON(info));
			var otherCode = requireAfterWrite('i18n_handler_example_i18nc_nocode_output.js', info.code, {readMode: 'string'});

			expect(getOutputJSON(info)).to.eql(outputJSON);
			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});

		it('#widthcode', function()
		{
			var funcInfo = require('./files/i18n_handler_example_output.json');
			var codeData =
			{
				DEFAULTS: Object.keys(funcInfo.__TRANSLATE_JSON__.en.DEFAULTS),
				SUBTYPES:
				{
					subtype: Object.keys(funcInfo.__TRANSLATE_JSON__.en.SUBTYPES.subtype)
				}
			};

			codeData = '\nvar codeJSON = '+JSON.stringify(codeData, null, '\t');

			var info = i18nc(exampleCode+codeData,
			{
				dbTranslateWords: dbTranslateWords
			});

			var outputJSON = requireAfterWrite('i18n_handler_example_i18nc_wdithcode_output.json', getOutputJSON(info));
			var otherCode = requireAfterWrite('i18n_handler_example_i18nc_wdithcode_output.js', info.code, {readMode: 'string'});

			expect(getOutputJSON(info)).to.eql(outputJSON);
			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});
	});


	describe('#insert when noi18n', function()
	{
		it('#noI18N', function()
		{
			var exampleCode = require('./files/func_code_noi18n').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_noi18n_output.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});

		it('#noI18N noclosure', function()
		{
			var exampleCode = require('./files/func_code_noi18n').toString();
			var info = i18nc(exampleCode, {isClosureWhenInsertedHead: false});

			var otherCode = requireAfterWrite('func_code_noi18n_output_noclosure.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});

		it('#define', function()
		{
			var exampleCode = require('./files/func_code_noi18n_define').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_noi18n_define_output.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});

		it('#define not_define', function()
		{
			var exampleCode = require('./files/func_code_noi18n_define').toString();
			var info = i18nc(exampleCode,
				{
					isInsertToDefineHalder: false
				});

			var otherCode = requireAfterWrite('func_code_noi18n_define_output_notdefine.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});
	});

	describe('#simple i18n', function()
	{
		it('#one i18n', function()
		{
			var exampleCode = require('./files/func_code_i18n').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_i18n_output.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});

		it('#define and scope', function()
		{
			var exampleCode = require('./files/func_code_i18n_define').toString();
			var info = i18nc(exampleCode,
				{
					dbTranslateWords:
					{
						zh:
						{
							'<allfile>':
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

			var otherCode = requireAfterWrite('func_code_i18n_define_output.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});


		it('#no words', function()
		{
			var exampleCode = require('./files/func_code_i18n_nowords').toString();
			var info = i18nc(exampleCode);

			var otherCode = requireAfterWrite('func_code_i18n_nowords_output.js', info.code, {readMode: 'string'});

			expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
		});
	});


	it('#head has content', function()
	{
		var info = i18nc('/* some things */\ndefine(function(){console.log("中文")})');

		var otherCode = requireAfterWrite('func_code_head_has_content_output.js', info.code, {readMode: 'string'});

		expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
	});

	it('#ignoreScanFunctionNames', function()
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
		}

		var info = i18nc(code.toString(), {ignoreScanFunctionNames: ['somefunc']});

		expect(getTranslateWords(info.codeTranslateWords))
			.to.eql(['中文 in other func', '中文 run other func'].sort());
	});
});


function getOutputJSON(info)
{
	return {
		codeTranslateWords: info.codeTranslateWords,
		funcTranslateWords: info.funcTranslateWords,
		usedTranslateWords: info.usedTranslateWords
	};
}

function getTranslateWords(codeTranslateWords)
{
	var translateWords = _.map(codeTranslateWords.SUBTYPES, function(val)
		{
			return val;
		});
	translateWords = [].concat.apply(codeTranslateWords.DEFAULTS, translateWords);

	return _.uniq(translateWords).sort();
}

function code2arr(code)
{
	return code.split('\n')
		.filter(function(val)
		{
			return val.trim();
		});
}

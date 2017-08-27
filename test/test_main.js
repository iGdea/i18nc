var _					= require('lodash');
var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoWriteFile		= require('./files/auto_write_file');
var dbTranslateWords	= require('./example/translate_words_db');

describe('#i18nc', function()
{
	describe('#nodb noFuncData', function()
	{
		var exampleCode			= require('./example/func_code');
		var exampleCode_output	= require('./example/func_code_output');
		var translateWords		= ["2中文4中文5","I18N(中文)","print中文","run 中文","中午true","中文0","中文1","中文2","中文3","中文I18N","中文I18N subtype","中文case","中文case+handler","中文case+objkey","中文case+数字","中文false","中文if","中文key","中文span","中文span2","中文span3","中文val","再来一句，","中文val in object","中文 only db","中文 only file","简体"].sort();


		it('#first', function()
		{
			var info = i18nc(exampleCode.toString(),
				{
					isIgnoreScanWarn: true,
					dbTranslateWords: dbTranslateWords
				});

			autoWriteFile('func_code_output.js', 'module.exports = '+info.code, 'example');

			expect(code2arr(info.code)).to.eql(code2arr(exampleCode_output.toString()));
			eval('var exampleCode_new ='+info.code);
			// console.log(JSON.stringify(getTranslateWords(info.codeTranslateWords)));

			expect(exampleCode_new()).to.be(exampleCode());
			expect(getTranslateWords(info.codeTranslateWords)).to.eql(translateWords);
			expect(info.dirtyWords).to.empty();
		});


		it('#retry', function()
		{
			var info = i18nc(exampleCode_output.toString(),
				{
					isIgnoreScanWarn: true,
					dbTranslateWords: dbTranslateWords
				});

			autoWriteFile('func_code_output.json', getOutputJSON(info), 'example');

			expect(code2arr(info.code)).to.eql(code2arr(exampleCode_output.toString()));
			eval('var exampleCode_new ='+info.code);

			expect(exampleCode_new()).to.be(exampleCode());
			expect(getTranslateWords(info.codeTranslateWords)).to.eql(translateWords);
			expect(info.dirtyWords).to.empty();
		});
	});



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

			autoWriteFile('i18n_handler_example_i18nc_nocode_output.json', getOutputJSON(info));
			autoWriteFile('i18n_handler_example_i18nc_nocode_output.js', info.code);

			expect(getOutputJSON(info)).to.eql(require('./files/i18n_handler_example_i18nc_nocode_output.json'));
			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/i18n_handler_example_i18nc_nocode_output.js').toString()));
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

			autoWriteFile('i18n_handler_example_i18nc_wdithcode_output.json', getOutputJSON(info));
			autoWriteFile('i18n_handler_example_i18nc_wdithcode_output.js', info.code);

			expect(getOutputJSON(info)).to.eql(require('./files/i18n_handler_example_i18nc_wdithcode_output.json'));
			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/i18n_handler_example_i18nc_wdithcode_output.js').toString()));
		});
	});


	describe('#insert when noi18n', function()
	{
		it('#noI18N', function()
		{
			var exampleCode = require('./files/func_code_noi18n').toString();
			var info = i18nc(exampleCode);

			autoWriteFile('func_code_noi18n_output.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_noi18n_output.js').toString()));
		});

		it('#noI18N noclosure', function()
		{
			var exampleCode = require('./files/func_code_noi18n').toString();
			var info = i18nc(exampleCode, {isClosureWhenInsertedHead: false});

			autoWriteFile('func_code_noi18n_output_noclosure.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_noi18n_output_noclosure.js').toString()));
		});

		it('#define', function()
		{
			var exampleCode = require('./files/func_code_noi18n_define').toString();
			var info = i18nc(exampleCode);

			autoWriteFile('func_code_noi18n_define_output.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_noi18n_define_output.js').toString()));
		});

		it('#define not_define', function()
		{
			var exampleCode = require('./files/func_code_noi18n_define').toString();
			var info = i18nc(exampleCode,
				{
					isInsertToDefineHalder: false
				});

			autoWriteFile('func_code_noi18n_define_output_notdefine.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_noi18n_define_output_notdefine.js').toString()));
		});
	});

	describe('#simple i18n', function()
	{
		it('#one i18n', function()
		{
			var exampleCode = require('./files/func_code_i18n').toString();
			var info = i18nc(exampleCode);

			autoWriteFile('func_code_i18n_output.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_i18n_output.js').toString()));
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

			autoWriteFile('func_code_i18n_define_output.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_i18n_define_output.js').toString()));
		});


		it('#no words', function()
		{
			var exampleCode = require('./files/func_code_i18n_nowords').toString();
			var info = i18nc(exampleCode);

			autoWriteFile('func_code_i18n_nowords_output.js', info.code);

			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/func_code_i18n_nowords_output.js').toString()));
		});
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
		.map(function(val)
		{
			return val.trim();
		})
		.filter(function(val)
		{
			return val;
		});
}

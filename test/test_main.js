var _				= require('lodash');
var fs				= require('fs');
var expect			= require('expect.js');
var i18nc			= require('../');
var autoWriteFile	= require('./files/auto_write_file');

describe('#i18nc', function()
{
	describe('#nodb noFuncData', function()
	{
		var exampleCode			= require('./example/func_code');
		var exampleCode_output	= require('./example/func_code_output');
		var translateWords		= ['中文0', '中文1', '2中文4中文5', '中文span', '中文span2', '中文span3', '中文2', '中文3', '中文key', '中文val', '再来', '2中', '我中文们', '一般不会吧', '中午呢', '中文呢？', 'I18N(中文)', '中文I18N', '中文I18N2'].sort();


		it('#first', function()
		{
			var info = i18nc(exampleCode.toString());

			autoWriteFile('func_code_output.js', 'module.exports = '+info.code, 'example');

			expect(code2arr(info.code)).to.eql(code2arr(exampleCode_output.toString()));
			eval('var exampleCode_new ='+info.code);


			expect(exampleCode_new()).to.be(exampleCode());
			expect(getTranslateWords(info.codeTranslateWords)).to.eql(translateWords);
			expect(info.dirtyWords).to.empty();
		});


		it('#retry', function()
		{
			var info = i18nc(exampleCode_output.toString());

			autoWriteFile('func_code_output_code.json', info.codeTranslateWords, 'example');
			autoWriteFile('func_code_output_func.json', info.funcTranslateWords, 'example');

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
		var dbTranslateWords = require('./example/translate_words_db');
		exampleCode = 'module.exports = I18N;\n'+exampleCode.toString();

		it('#nocode', function()
		{
			var info = i18nc(exampleCode,
			{
				dbTranslateWords: dbTranslateWords
			});

			autoWriteFile('i18n_handler_example_i18nc_nocode_output_code.json', info.codeTranslateWords);
			autoWriteFile('i18n_handler_example_i18nc_nocode_output_func.json', info.funcTranslateWords);
			autoWriteFile('i18n_handler_example_i18nc_nocode_output_code.js', info.code);

			expect(info.codeTranslateWords).to.eql(require('./files/i18n_handler_example_i18nc_nocode_output_code.json'));
			expect(info.funcTranslateWords).to.eql(require('./files/i18n_handler_example_i18nc_nocode_output_func.json'));
			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/i18n_handler_example_i18nc_nocode_output_code.js').toString()));
		});

		it('#widthcode', function()
		{
			var funcInfo = require('./files/i18n_handler_example_output.json');
			var codeData =
			{
				DEFAULTS: Object.keys(funcInfo.__TRANSLATE_JSON__.zh.DEFAULTS),
				SUBTYPES:
				{
					subtype: Object.keys(funcInfo.__TRANSLATE_JSON__.zh.SUBTYPES.subtype)
				}
			};

			codeData = '\nvar codeJSON = '+JSON.stringify(codeData, null, '\t');

			var info = i18nc(exampleCode+codeData,
			{
				dbTranslateWords: dbTranslateWords
			});

			autoWriteFile('i18n_handler_example_i18nc_wdithcode_output_code.json', info.codeTranslateWords);
			autoWriteFile('i18n_handler_example_i18nc_wdithcode_output_func.json', info.funcTranslateWords);
			autoWriteFile('i18n_handler_example_i18nc_wdithcode_output_used.json', info.usedTranslateWords);
			autoWriteFile('i18n_handler_example_i18nc_wdithcode_output_code.js', info.code);

			expect(info.codeTranslateWords).to.eql(require('./files/i18n_handler_example_i18nc_wdithcode_output_code.json'));
			expect(info.funcTranslateWords).to.eql(require('./files/i18n_handler_example_i18nc_wdithcode_output_func.json'));
			expect(info.usedTranslateWords).to.eql(require('./files/i18n_handler_example_i18nc_wdithcode_output_used.json'));
			expect(code2arr(info.code)).to.eql(code2arr(fs.readFileSync(__dirname+'/files/i18n_handler_example_i18nc_wdithcode_output_code.js').toString()));
		})
	});
});


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

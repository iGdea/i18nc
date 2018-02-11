var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoTestUtils		= require('./auto_test_utils');
var dbTranslateWords	= require('./example/translate_words_db');

describe('#example', function()
{
	describe('#func_code', function()
	{
		var requireAfterWrite	= autoTestUtils.requireAfterWrite('example');
		var exampleCode			= require('./example/func_code');
		var translateWords		=
		[
			"2中文4中文5","I18N(中文)","print中文","run 中文","中午true","中文0",
			"中文1","中文2","中文3","中文I18N","中文I18N subtype","中文case",
			"中文case+handler","中文case+objkey","中文case+数字","中文false",
			"中文if","中文key","中文span","中文span2","中文span3","中文val",
			"再来一句，","中文val in object","中文 only db","中文 only file","简体"
		]
		.sort();


		it('#first', function()
		{
			var info = i18nc(exampleCode.toString(),
				{
					ignoreScanError: ['ObjectKey'],
					dbTranslateWords: dbTranslateWords
				});

			var content = 'module.exports = '+info.code;
			var otherContent = requireAfterWrite('func_code_output.js', content, {readMode: 'string'});

			expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.eql(translateWords);
			expect(info.dirtyAsts).to.empty();
		});


		it('#retry', function()
		{
			var exampleCode_output = require('./example/func_code_output').toString();
			var info = i18nc(exampleCode_output,
				{
					ignoreScanError: ['ObjectKey'],
					dbTranslateWords: dbTranslateWords
				});

			requireAfterWrite('func_code_output.json', autoTestUtils.JsonOfI18ncRet(info));

			expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(exampleCode_output));
			expect(autoTestUtils.getCodeTranslateAllWords(info)).to.eql(translateWords);
			expect(info.dirtyAsts).to.empty();
		});
	});


	it('#use require', function()
	{
		var requireAfterWrite	= autoTestUtils.requireAfterWrite('use_require');
		var i18nOptions =
		{
			ignoreScanError: ['ObjectKey'],
			dbTranslateWords: dbTranslateWords,
			loadTranslateJSON: function(emitData)
			{
				var ast = emitData.ast;

				if (ast.type == 'CallExpression'
					&& ast.callee
					&& ast.callee.name == 'require'
					&& ast.arguments
					&& ast.arguments[0]
					&& ast.arguments[0].type == 'Literal')
				{
					var file = __dirname+'/example/cases/use_require/'+ast.arguments[0].value;
					var newAst = i18nc.parse(fs.readFileSync(file).toString());

					var retAst = newAst.body
						&& newAst.body[0]
						&& newAst.body[0].expression
						&& newAst.body[0].expression.right;

					if (retAst)
					{
						emitData.ast = retAst;
					}
				}
			},
			newTranslateJSON: function(emitData)
			{
				var content = 'module.exports = '+emitData.translateJSONCode;
				var otherContent = requireAfterWrite('require_data.js', content, {readMode: 'string'});
				expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent.toString()));

				emitData.translateJSONCode = 'require("./require_data.js")';
			},
		};

		var exampleCode = require('./example/cases/use_require/func_code');
		var info = i18nc(exampleCode.toString(), i18nOptions);

		var otherCode = requireAfterWrite('func_code_output.js', 'module.exports = '+info.code);

		expect(autoTestUtils.code2arr(info.code)).to.eql(autoTestUtils.code2arr(otherCode.toString()));
	});
});

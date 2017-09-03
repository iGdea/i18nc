var _					= require('lodash');
var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var requireAfterWrite	= require('./auto_test_utils').requireAfterWrite;
var dbTranslateWords	= require('./example/translate_words_db');

describe('#example', function()
{
	describe('#func_code', function()
	{
		var exampleCode			= require('./example/func_code');
		var exampleCode_output	= require('./example/func_code_output');
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
					isIgnoreScanWarn: true,
					dbTranslateWords: dbTranslateWords
				});

			requireAfterWrite('func_code_output.js', 'module.exports = '+info.code, 'example');

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

			requireAfterWrite('func_code_output.json', getOutputJSON(info), 'example');

			expect(code2arr(info.code)).to.eql(code2arr(exampleCode_output.toString()));
			eval('var exampleCode_new ='+info.code);

			expect(exampleCode_new()).to.be(exampleCode());
			expect(getTranslateWords(info.codeTranslateWords)).to.eql(translateWords);
			expect(info.dirtyWords).to.empty();
		});
	});


	it('#use require', function()
	{
		var i18nOptions =
		{
			isIgnoreScanWarn: true,
			dbTranslateWords: dbTranslateWords,
			loadTranslateJSONByAst: function(ast, options)
			{
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

					if (retAst) return retAst;
				}

				return ast;
			},
			genTranslateJSON: function(code, translateData, translateDataAst, options)
			{
				var content = 'module.exports = '+code;
				
				var otherContent = requireAfterWrite('require_data.js', content, 'use_require', {readMode: 'string'});

				expect(code2arr(content)).to.eql(code2arr(otherContent.toString()));

				return 'require("./require_data.js")';
			},
		};

		var exampleCode = require('./example/cases/use_require/func_code');
		var info = i18nc(exampleCode.toString(), i18nOptions);

		var otherCode = requireAfterWrite('func_code_output.js', 'module.exports = '+info.code, 'use_require');

		expect(code2arr(info.code)).to.eql(code2arr(otherCode.toString()));
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

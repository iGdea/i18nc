var _					= require('lodash');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoWriteFile		= require('./files/auto_write_file');
var exampleCode			= require('./example/func_code');
var exampleCode_output	= require('./example/func_code_output');

describe('#i18nc', function()
{
	var translateWords = ['中文0', '中文1', '2中文4中文5', '中文span', '中文span2', '中文span3', '中文2', '中文3', '中文key', '中文val', '再来', '2中', '我中文们', '一般不会吧', '中午呢', '中文呢？', 'I18N(中文)', '中文I18N', '中文I18N2'].sort();


	it('#first', function()
	{
		var info = i18nc(exampleCode.toString());

		autoWriteFile('func_code_output.js', 'module.exports = '+info.code, 'example');

		expect(info.code.split('\n')).to.eql(exampleCode_output.toString().split('\n'));
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

		expect(info.code.split('\n')).to.eql(exampleCode_output.toString().split('\n'));
		eval('var exampleCode_new ='+info.code);

		expect(exampleCode_new()).to.be(exampleCode());
		expect(getTranslateWords(info.codeTranslateWords)).to.eql(translateWords);
		expect(info.dirtyWords).to.empty();
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


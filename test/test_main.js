var fs				= require('fs');
var _				= require('lodash');
var expect			= require('expect.js');
var i18nc			= require('../');
var example1		= require('./files/example1');
var example1_output	= require('./files/example1_output');

describe('#i18nc', function()
{
	var translateWords = ['中文0', '中文1', '2中文4中文5', '中文span', '中文span2', '中文span3', '中文2', '中文3', '中文key', '中文val', '再来', '2中', '我中文们', '一般不会吧', '中午呢', '中文呢？', 'I18N(中文)', '中文I18N', '中文I18N2'].sort();


	it('#first', function()
	{
		var info = i18nc(example1.toString());

		// fs.writeFileSync(__dirname+'/files/example1_output.js', 'module.exports = '+info.code);

		expect(info.code.split('\n')).to.eql(example1_output.toString().split('\n'));
		eval('var example1_new ='+info.code);


		expect(example1_new()).to.be(example1());
		expect(getTranslateWords(info.codeTranslateWords)).to.eql(translateWords);
		expect(info.dirtyWords).to.empty();
	});


	it('#retry', function()
	{
		var info = i18nc(example1_output.toString());

		// fs.writeFileSync(__dirname+'/files/example1_output_code.json', JSON.stringify(info.codeTranslateWords, null, '\t'));
		// fs.writeFileSync(__dirname+'/files/example1_output_func.json', JSON.stringify(info.funcTranslateWords, null, '\t'));

		expect(info.code.split('\n')).to.eql(example1_output.toString().split('\n'));
		eval('var example1_new ='+info.code);

		expect(example1_new()).to.be(example1());
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


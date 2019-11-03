module.exports = function code()
{
	var word = '中文';
	consol.log(word, "中文2");
	I18N('中文3', ['中文4', I18N('中文5')]);
	I18N('中文4', 'subkey');
	I18N('中文5', { subkey: 'subkey' });


	function I18N(){}
}

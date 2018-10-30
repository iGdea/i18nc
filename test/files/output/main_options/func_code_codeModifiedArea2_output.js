module.exports = function code()
{
	var word = I18N('中文');
	consol.log(word, I18N('中文2'));
	I18N('中文3', [I18N('中文4'), I18N('中文5')]);

	function I18N(){}
}

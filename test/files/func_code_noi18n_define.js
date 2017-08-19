module.exports = function code()
{
	define(function()
	{
		var word = '中文';
		consol.log(word, "中文2");
	});

	define('define2', function()
	{
		var word = 'define2 中文';
		consol.log(word, "define2 中文2");
	});
}

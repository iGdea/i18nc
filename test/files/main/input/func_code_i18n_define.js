module.exports = function code()
{
	var work = "global 中文1";
	define(function()
	{
		var word = 'define1 中文';
	});

	define('define2', function()
	{
		var word = 'define2 中文';
		function I18N(){}
	});

	function I18N(){}
	var work = "global 中文2";
	function I18N(){}
}

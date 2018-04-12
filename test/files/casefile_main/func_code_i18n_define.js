module.exports = function code()
{
	var word = 'out define 中文';

	define(function()
	{
		word = '中文';
	});

	define('define2', function()
	{
		word = 'define2 中文';
	});

	// define 的中文包含在subscope，本身不包含中文
	define('define3', function()
	{
		function somehadler()
		{
			word = 'define3 中文'
		}
	});

	define('define4', function()
	{
		// define 嵌套
		word = 'define4 中文';

		define('define5', function()
		{
			word = 'define5 中文';
		});
	});


	// 预先定义了I18N函数
	function somehadler()
	{
		function I18N(){}

		define('define6', function()
		{
			word = 'define6 中文';
		});
	}
}

exports.base = function code()
{
	var v1 = "中文1";

	function func2()
	{
		var v1 = "中文2";
	}
};

exports.has_I18N = function code()
{
	var v1 = "中文1";

	function func2()
	{
		var v1 = "中文2";
	}

	function I18N(){}
};

exports.has_define = function code()
{
	var v1 = "中文1";

	function func2()
	{
		var v1 = "中文2";
	}

	define(function()
	{
		var v1 = "中文3"
	});
	function I18N(){}
};

exports.mulit_define = function code()
{
	var v1 = "中文1";

	function func2()
	{
		var v1 = "中文2";
	}

	define(function()
	{
		var v1 = "中文3"
	});

	define('define', function()
	{
		var v1 = "中文4"
	});

	function I18N(){}
};

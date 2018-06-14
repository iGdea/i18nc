exports.simple = function I18N(g,f,i)
{
	var a = I18N;
	a.V = '8';
};

exports.nothandler = function I18N(g,f,i)
{
	var b = I18N1, a = I18N;
	b.V = '8';
};

exports.otherscope = function I18N(g,f,i)
{
	var a = I18N;
	(function()
	{
		var a = CC;
		a.V = '8';
	})();
};

exports.otherscope2 = function I18N(g,f,i)
{
	var a = I18N;
	void function xxxx()
	{
		var a = CC;
		a.V = '8';
	}();
};

exports.otherscope3 = function I18N(g,f,i)
{
	var a = I18N;
	function xxxx()
	{
		var a = CC;
		a.V = '8';
	};
};

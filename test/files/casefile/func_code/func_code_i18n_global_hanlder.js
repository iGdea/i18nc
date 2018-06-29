module.exports = function code()
{
	var word = '中文';
	function I18N(msg)
	{
		return ''+window.topI18N(msg, arguments);
	}
}

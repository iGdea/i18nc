module.exports = function code()
{
	var word = I18N('中文db *');
	println(word, I18N('中文2'));

	function I18N(msg, tpldata, subkey)
	{
		var self = I18N;
		self.K = '*';
		self.V = '0f';
		self.D = require("./require_data.json");
		return msg;
	}
}

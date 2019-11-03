module.exports = function code()
{
	function I18N()
	{
		var self = I18N;
		self.__FILE_KEY__ = '*';
		self.__FUNCTION_VERSION__ = '5s';
	}

	alert('中文');
	alert('简体');
	I18N('中文I18N');
	I18N('简体', 'subkey');
	I18N('简体', 'subkey2');
	I18N('中文I18N subkey', 'subkey');
	I18N('中文I18N subkey2', 'subkey');
	I18N('中文I18N subkey', 'subkey2');

	function scope1()
	{
		function I18N()
		{
			var self = I18N;
			self.__FILE_KEY__ = 'fileKey';
			self.__FUNCTION_VERSION__ = '5s';
		}

		I18N('中文I18N subkey', ':subkey');
		I18N('中文I18N subkey2', ':subkey');
	}

	function scope2()
	{
		function I18N()
		{
			var self = I18N;
			self.__FILE_KEY__ = '*';
			self.__FUNCTION_VERSION__ = '5s';
		}

		I18N('中文I18N subkey3', ':subkey');
		I18N('中文I18N subkey4', ':subkey');


		function scope3()
		{
			function I18N()
			{
				var self = I18N;
				self.__FILE_KEY__ = '*';
				self.__FUNCTION_VERSION__ = '5s';
			}

			I18N('中文I18N subkey5', ':subkey');
			I18N('中文I18N subkey6', ':subkey@sub');
		}
	}

}

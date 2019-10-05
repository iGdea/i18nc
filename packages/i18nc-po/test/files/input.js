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
	I18N('简体', 'subtype');
	I18N('简体', 'subtype2');
	I18N('中文I18N subtype', 'subtype');
	I18N('中文I18N subtype2', 'subtype');
	I18N('中文I18N subtype', 'subtype2');

	function scope1()
	{
		function I18N()
		{
			var self = I18N;
			self.__FILE_KEY__ = 'fileKey';
			self.__FUNCTION_VERSION__ = '5s';
		}

		I18N('中文I18N subtype', ':subtype');
		I18N('中文I18N subtype2', ':subtype');
	}

	function scope2()
	{
		function I18N()
		{
			var self = I18N;
			self.__FILE_KEY__ = '*';
			self.__FUNCTION_VERSION__ = '5s';
		}

		I18N('中文I18N subtype3', ':subtype');
		I18N('中文I18N subtype4', ':subtype');


		function scope3()
		{
			function I18N()
			{
				var self = I18N;
				self.__FILE_KEY__ = '*';
				self.__FUNCTION_VERSION__ = '5s';
			}

			I18N('中文I18N subtype5', ':subtype');
			I18N('中文I18N subtype6', ':subtype@sub');
		}
	}

}

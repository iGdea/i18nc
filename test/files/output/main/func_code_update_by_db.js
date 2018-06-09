function code()
			{
				println(I18N('简体'));
				function I18N()
				{
					var self = I18N;
					self.__FILE_KEY__ = "default_file_key";
					self.__FUNCTION_VERSION__ = "a";
					self.__TRANSLATE_JSON__ =
					{ 'zh-TW': { 'DEFAULTS': { '简体': '簡體' } } };
				}
			}
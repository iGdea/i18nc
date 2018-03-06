function code()
			{
				console.log(I18N('不可能存在的中文翻译词组'));
				function I18N()
				{
					self = I18N;
					self.__FILE_KEY__ = "default_file_key";
					self.__FUNCTION_VERSION__ = "5";
					self.__TRANSLATE_JSON__ =
					{
						'en-US': {
							'DEFAULTS': {
								// '不可能存在的中文翻译词组':
								'<e.g.> translate word': null
							}
						}
					};
				}
			}
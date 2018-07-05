module.exports = function code()
			{
				println(I18N('不可能存在的中文翻译词组'));
				function I18N()
				{
					var self = I18N;
					self.__FILE_KEY__ = "default_file_key";
					self.__FUNCTION_VERSION__ = "b";
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

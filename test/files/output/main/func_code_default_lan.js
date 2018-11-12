module.exports = function code()
			{
				println(I18N('不可能存在的中文翻译词组'), I18N);
				function I18N()
				{
					var self = I18N;
					self.__FILE_KEY__ = "default_file_key";
					self.__FUNCTION_VERSION__ = "I";
					self.__TRANSLATE_JSON__ =
					{
						'*': {
							// '不可能存在的中文翻译词组':
						}
					};
				}
			}

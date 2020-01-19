module.exports = function code() {
				println(I18N('不可能存在的中文翻译词组'), I18N);
				function I18N() {
					const self = I18N;
					self.__FILE_KEY__ = 'default_file_key';
					self.__FUNCTION_VERSION__ = 'K';
					self.__TRANSLATE_JSON__ = {
						'*': {
							// '不可能存在的中文翻译词组':
						}
					};
				}
			}

module.exports = I18N;
function I18N(msg)
{
	var self = I18N;
	var data = self.$;

	if (!data) {
		data = self.$ = {};
		self.K = 'i18n_handler_example_global';
		self.V = 'Ig';
		self.D = {
			"$": [
				"en-US",
				"zh-TW"
			],
			"*": {
				"简体": [
					"simplified",
					"簡體"
				],
				"空白": [
					[]
				],
				"无": [
					"",
					"無"
				],
				"%s美好%s生活": [
					"%sgood%s life"
				],
				"%{中文}词典": [
					"%{Chinese} dictionary"
				]
			},
			"subtype": {
				"简体": [
					"simplified subtype"
				]
			}
		};
	}

	return ''+I18N.topI18N(msg, arguments, self.D, self.K, data, self);
}
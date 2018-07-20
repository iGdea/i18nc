module.exports = I18N;
function I18N(msg)
{
	var self = I18N;
	var data = self.$;

	if (!data)
	{
		data = self.$ = {};
		self.K = 'i18n_handler_example_global';
		self.V = 'b.g';
		self.D = {
			"en-US": {
				"DEFAULTS": {
					"简体": "simplified",
					"空白": [],
					"无": "",
					"%s美好%s生活": "%sgood%s life",
					"%{中文}词典": "%{Chinese} dictionary"
				},
				"SUBTYPES": {
					"subtype": {
						"简体": "simplified subtype"
					}
				}
			},
			"zh-TW": {
				"DEFAULTS": {
					"简体": "簡體",
					"无": "無"
				}
			}
		};
	}

	return ''+I18N.topI18N(msg, arguments, self.D, self.K, data, self);
}
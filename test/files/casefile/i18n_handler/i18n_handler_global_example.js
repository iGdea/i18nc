module.exports = I18N;
function I18N(c){
	var a=I18N;var b=a.$;if(!b){b=a.$={};a.K='i18n_handler_example';a.V='b';a.D={
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
	}
	}return''+I18N.topI18N(c,arguments,a.D,a.K,b,a)
}
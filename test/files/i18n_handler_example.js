module.exports = I18N;
function I18N(h,f,i){
	var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return h;if(!f||!f.join){i=f;f=[]}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='i18n_handler_example';a.__FUNCTION_VERSION__='5';a.__TRANSLATE_JSON__={
		"en-US": {
			"DEFAULTS": {
				"中文0": "in_file zh0",
				"中文1": "in_file custom1",
				"中文2": "in_file zh2_db",
				"中文3_empty": "",
				"中文4_empty": "",
				"中文5_empty": [],
				"中文6_empty": "in_file 4",
				"中文db *": "in file *"
			},
			"SUBTYPES": {
				"subtype": {
					"中文0": "in_file subtye_zh0",
					"中文1": "in_file ubtye_custom1",
					"中文2": "in_file subtye_zh2_db",
					"中文3_empty": "",
					"中文 allfile subtype1": "in_file allfile subtype1",
					"中文 thisfile subtype2": "in_file thisfile subtype2"
				}
			}
		},
		"zh-TW": {
			"DEFAULTS": {
				"中文0": "中文0 in tw"
			}
		}
	}
	;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=n[j[b]];if(c)e.push(c)}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var q=l||k||h;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})
}
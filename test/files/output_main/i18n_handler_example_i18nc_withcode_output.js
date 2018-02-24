module.exports = I18N;
function I18N(h,f,i){
	var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return h;if(!f||!f.join){i=f;f=[]}if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='i18n_handler_example';a.__FUNCTION_VERSION__='5';a.__TRANSLATE_JSON__={
		'en-US': {
			'DEFAULTS': {
				'%s美好%s生活': '%sgood%s life',
				'%{中文}词典': '%{Chinese} dictionary',
				// "空白":
				'简体': 'simplified'
			}
		},
		'zh-TW': {
			'DEFAULTS': {
				// "%s美好%s生活":
				// "%{中文}词典":
				// "空白":
				'简体': '簡體'
			}
		}
	}
	;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=n[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var q=l||k||h;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})
}
var codeJSON = {
	"DEFAULTS": [
		I18N('简体'),
		I18N('空白'),
		I18N('%s美好%s生活'),
		I18N('%{中文}词典')
	],
	"SUBTYPES": {
		"subtype": [
			I18N('简体')
		]
	}
}
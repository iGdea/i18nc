function code()
{
	var word = I18N('中文');
	consol.log(word, I18N('中文2'));

	function I18N(g,f,i){
		var a=I18N;if(!a.data)a.data={};var d=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(a.data);if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
			'en-US': {
				'DEFAULTS': {
					// '中文':
					// '中文2':
					'<e.g.> translate word': null
				}
			}
		};
		var o=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,h=j.length;b<h;b++){var c=o[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,h=e.length;b<h;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[g];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[g]}var n=l||k;if(n)g=n}if(!f.length)return''+g;var p=0;return(''+g).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[p++];return a===undefined||a===null?b:a})
	}
}
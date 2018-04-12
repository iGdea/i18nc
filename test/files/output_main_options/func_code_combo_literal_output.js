function code()
{

	function I18N(h,f,i){
		/*eslint-disable*/
		var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='7';a.__TRANSLATE_JSON__={
			'en-US': {
				'DEFAULTS': {
					// '123中文abc':
					// '222简体3332':
					// '中文abc':
					'<e.g.> translate word': null
				}
			}
		};
		var q=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=q[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var n=l||k;if(n)h=n}var p=0;return(''+h).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a});
		/*eslint-enable*/
	}


	var a = I18N('123中文abc');
	var b = '123>' + I18N('中文abc');
	var c = '<span>11</span>55'+'<span>11</span>'+I18N('222简体3332') + '<span>22</span>';
	var d = '1'+'2';
}
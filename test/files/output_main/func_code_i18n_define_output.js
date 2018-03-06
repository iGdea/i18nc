function code()
{
	var work = I18N('global 中文1');
	define(function()
	{
		var word = I18N('define1 中文');
	});

	define('define2', function()
	{
		var word = I18N('define2 中文');
		function I18N(h,f,i){
			var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='6';a.__TRANSLATE_JSON__={ 'zh': { 'DEFAULTS': { 'define2 中文': 'define2 中文' } } }
			;var q=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=q[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var n=l||k;if(n)h=n}var p=0;return(''+h).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})
		}
	});

	function I18N(d,a){
		var b=I18N;b.__FILE_KEY__='*';b.__FUNCTION_VERSION__='6.s';if(!a||!a.join)a=[];var c=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(){var b=a[c++];return b===undefined||b===null?'':b})
	}
	var work = I18N('global 中文2');
	function I18N(h,f,i){
		var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='6';a.__TRANSLATE_JSON__={
			'zh': {
				'DEFAULTS': {
					'define1 中文': 'define1 中文',
					'global 中文1': 'global 中文1',
					'global 中文2': 'global 中文2'
				}
			}
		}
		;var q=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=q[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var n=l||k;if(n)h=n}var p=0;return(''+h).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})
	}
}
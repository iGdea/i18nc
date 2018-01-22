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
		function I18N(g,h,i){var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return g;if(!h.slice){i=h;h=[]}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='3';a.__TRANSLATE_JSON__={ 'zh': { 'DEFAULTS': { 'define2 中文': 'define2 中文' } } }
		;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,f=j.length;b<f;b++){var c=n[j[b]];if(c)e.push(c)}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,f=e.length;b<f;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[g];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[g]}var q=l||k||g;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=h[p++];return a===undefined||a===null?'':a})}
	});

	function I18N(d,a){var b=I18N;b.__FILE_KEY__='*';b.__FUNCTION_VERSION__='3.s';if(!a.slice)a=[];var c=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(){var b=a[c++];return b===undefined||b===null?'':b})}
	var work = I18N('global 中文2');
	function I18N(g,h,i){var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return g;if(!h.slice){i=h;h=[]}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='3';a.__TRANSLATE_JSON__={
					'zh': {
						'DEFAULTS': {
							'define1 中文': 'define1 中文',
							'global 中文1': 'global 中文1',
							'global 中文2': 'global 中文2'
						}
					}
				}
	;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,f=j.length;b<f;b++){var c=n[j[b]];if(c)e.push(c)}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,f=e.length;b<f;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[g];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[g]}var q=l||k||g;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=h[p++];return a===undefined||a===null?'':a})}
}
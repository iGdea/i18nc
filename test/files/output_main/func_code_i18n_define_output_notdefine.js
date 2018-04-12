function code()
{

	function I18N(h,f,i){
		var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='6';a.__TRANSLATE_JSON__={
			'en-US': {
				'DEFAULTS': {
					// 'define2 中文':
					// 'define3 中文':
					// 'define4 中文':
					// 'define5 中文':
					// 'out define 中文':
					// '中文':
					'<e.g.> translate word': null
				}
			}
		}
		;var q=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=q[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var n=l||k;if(n)h=n}var p=0;return(''+h).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})
	}


	var word = I18N('out define 中文');

	define(function()
	{
		word = I18N('中文');
	});

	define('define2', function()
	{
		word = I18N('define2 中文');
	});

	// define 的中文包含在subscope，本身不包含中文
	define('define3', function()
	{
		function somehadler()
		{
			word = I18N('define3 中文')
		}
	});

	define('define4', function()
	{
		// define 嵌套
		word = I18N('define4 中文');

		define('define5', function()
		{
			word = I18N('define5 中文');
		});
	});


	// 预先定义了I18N函数
	function somehadler()
	{
		function I18N(h,f,i){
			var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='6';a.__TRANSLATE_JSON__={
				'en-US': {
					'DEFAULTS': {
						// 'define6 中文':
						'<e.g.> translate word': null
					}
				}
			}
			;var q=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=q[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var n=l||k;if(n)h=n}var p=0;return(''+h).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a})
		}

		define('define6', function()
		{
			word = I18N('define6 中文');
		});
	}
}
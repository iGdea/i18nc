function code()
{


	/* eslint-disable */
	function I18N(d,f,k){
		var a=I18N;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
			'en-US': {
				'DEFAULTS': {
					// 'out define 中文':
					'<e.g.> translate word': null
				}
			}
		};
		var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
	}
	/* eslint-enable */



	var word = I18N('out define 中文');

	define(function()
	{


		/* eslint-disable */
		function I18N(d,f,k){
			var a=I18N;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
				'en-US': {
					'DEFAULTS': {
						// '中文':
						'<e.g.> translate word': null
					}
				}
			};
			var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
		}
		/* eslint-enable */



		word = I18N('中文');
	});

	define('define2', function()
	{


		/* eslint-disable */
		function I18N(d,f,k){
			var a=I18N;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
				'en-US': {
					'DEFAULTS': {
						// 'define2 中文':
						'<e.g.> translate word': null
					}
				}
			};
			var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
		}
		/* eslint-enable */



		word = I18N('define2 中文');
	});

	// define 的中文包含在subscope，本身不包含中文
	define('define3', function()
	{


		/* eslint-disable */
		function I18N(d,f,k){
			var a=I18N;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
				'en-US': {
					'DEFAULTS': {
						// 'define3 中文':
						'<e.g.> translate word': null
					}
				}
			};
			var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
		}
		/* eslint-enable */



		function somehadler()
		{
			word = I18N('define3 中文')
		}
	});

	define('define4', function()
	{


		/* eslint-disable */
		function I18N(d,f,k){
			var a=I18N;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
				'en-US': {
					'DEFAULTS': {
						// 'define4 中文':
						// 'define5 中文':
						'<e.g.> translate word': null
					}
				}
			};
			var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
		}
		/* eslint-enable */



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
		function I18N(d,f,k){
			var a=I18N;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
				'en-US': {
					'DEFAULTS': {
						// 'define6 中文':
						'<e.g.> translate word': null
					}
				}
			};
			var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
		}

		define('define6', function()
		{
			word = I18N('define6 中文');
		});
	}
}
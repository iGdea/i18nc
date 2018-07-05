module.exports = function code()
{


	/* eslint-disable */
	function I18N(c,e,l){
		var a=I18N;var p=a.$||(a.$={});var d=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!e||!e.join){l=e;e=[]}if(d&&d.split){var g,b,h,f;if(a.L!=d){a.K='*';a.V='b';a.D={
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
		};
		var r=a.D;var k=d.split(',');g=a.M=[];for(b=0,h=k.length;b<h;b++){f=r[k[b]];if(f)g.push(f)}a.L=d}g=a.M;var j,i,m,n,o;for(b=0,h=g.length;b<h;b++){f=g[b];if(l){m=f.SUBTYPES;o=m&&m[l];i=o&&o[c];if(i)break}if(!j){n=f.DEFAULTS;j=n&&n[c]}}if(i)c=i;else if(j)c=j}if(!e.length)return''+c;var q=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=e[q++];return a===undefined||a===null?b:a})
	}
	/* eslint-enable */



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
		function I18N(c,e,l){
			var a=I18N;var p=a.$||(a.$={});var d=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!e||!e.join){l=e;e=[]}if(d&&d.split){var g,b,h,f;if(a.L!=d){a.K='*';a.V='b';a.D={
				'en-US': {
					'DEFAULTS': {
						// 'define6 中文':
						'<e.g.> translate word': null
					}
				}
			};
			var r=a.D;var k=d.split(',');g=a.M=[];for(b=0,h=k.length;b<h;b++){f=r[k[b]];if(f)g.push(f)}a.L=d}g=a.M;var j,i,m,n,o;for(b=0,h=g.length;b<h;b++){f=g[b];if(l){m=f.SUBTYPES;o=m&&m[l];i=o&&o[c];if(i)break}if(!j){n=f.DEFAULTS;j=n&&n[c]}}if(i)c=i;else if(j)c=j}if(!e.length)return''+c;var q=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=e[q++];return a===undefined||a===null?b:a})
		}

		define('define6', function()
		{
			word = I18N('define6 中文');
		});
	}
}
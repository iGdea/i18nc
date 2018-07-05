module.exports = function code()
{


	/* eslint-disable */
	function I18N(c,e,l){
		var a=I18N;var p=a.$||(a.$={});var d=(function(a){var b=a.g||(a.g=window.settings);return b._lan_})(p);if(!e||!e.join){l=e;e=[]}if(d&&d.split){var g,b,h,f;if(a.L!=d){a.K='*';a.V='b';a.D={
			'en-US': {
				'DEFAULTS': {
					// '中文':
					// '中文2':
					'<e.g.> translate word': null
				}
			}
		};
		var r=a.D;var k=d.split(',');g=a.M=[];for(b=0,h=k.length;b<h;b++){f=r[k[b]];if(f)g.push(f)}a.L=d}g=a.M;var j,i,m,n,o;for(b=0,h=g.length;b<h;b++){f=g[b];if(l){m=f.SUBTYPES;o=m&&m[l];i=o&&o[c];if(i)break}if(!j){n=f.DEFAULTS;j=n&&n[c]}}if(i)c=i;else if(j)c=j}if(!e.length)return''+c;var q=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=e[q++];return a===undefined||a===null?b:a})
	}
	/* eslint-enable */



	var word = I18N('中文');
	consol.log(word, I18N('中文2'));
}

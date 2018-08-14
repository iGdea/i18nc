module.exports = function code()
{


	/* eslint-disable */
	function I18N(b,e,l){
		var a=I18N;var p=a.$||(a.$={});var d=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!e||!e.join){l=e;e=[]}if(d&&d.split){var g,c,h,f;if(a.L!=d){a.K='*';a.V='bf';a.D={
			'en-US': {
				'DEFAULTS': {
					// '简体':
					'': null
				}
			}
		};
		var r=a.D;var k=d.split(',');g=a.M=[];for(c=0,h=k.length;c<h;c++){f=r[k[c]];if(f)g.push(f)}a.L=d}g=a.M;var j,i,m,n,o;for(c=0,h=g.length;c<h;c++){f=g[c];if(l){m=f.SUBTYPES;o=m&&m[l];i=o&&o[b];if(i)break}if(!j){n=f.DEFAULTS;j=n&&n[b]}}if(i)b=i;else if(j)b=j}b+='';if(!e.length||b.indexOf('%')==-1)return b;var q=0;return b.replace(/%s|%\{.+?\}/g,function(b){var a=e[q++];return a===undefined||a===null?b:a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

module.exports = function code()
{


	/* eslint-disable */
	function I18N(b,e,f){
		if(!b)return b===undefined||b===null?'':''+b;var a=I18N,q=a.$||(a.$={}),i,r=0,k={},j,c,g,d,l;if(!e||!e.join){f=e;e=[]}if(f&&typeof f=='object'){k=f;f=k.subkey}var h=k.language||(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(q);if(h&&h.split){if(a.L!=h){a.K='*';a.V='Kf';a.D={};
		i=a.D;var m=i.$||[],n={},o=h.split(',');j=a.M=[];for(c=m.length;c--;)n[m[c]]=c;for(c=o.length;c--;){g=n[o[c]];if(g||g===0)j.push(g)}a.L=h}j=a.M;i=a.D;var p=function(a){l=i[a]&&i[a][b];if(l){d=l[g];if(typeof d=='number')d=l[d]}};for(c=j.length;!d&&c--;){g=j[c];if(f)p(f);if(!d)p('*')}if(d)b=d}b+='';if(!e.length||b.indexOf('%')==-1)return b;return b.replace(/%\{(\d+)\}/g,function(c,b){var a=e[+b];return a===undefined?'':a}).replace(/%s|%p|%\{.+?\}/g,function(){var a=e[r++];return a===undefined?'':a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

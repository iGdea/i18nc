module.exports = function code()
{


	/* eslint-disable */
	function I18N(b,e,f){
		if(!b)return b===undefined||b===null?'':''+b;var a=I18N,q=a.$||(a.$={}),i,r=0,j={},k,c,g,d,l;if(!e||!e.join){f=e;e=[]}if(f&&typeof f=='object'){j=f;f=j.subkey}var h=j.language||(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(q);if(h&&h.split){if(a.L!=h){a.K='*';a.V='Lf';a.D={};
		i=a.D;var m=i.$||[],n={},o=h.split(',');k=a.M=[];for(c=m.length;c--;)n[m[c]]=c;for(c=o.length;c--;){g=n[o[c]];if(g||g===0)k.push(g)}a.L=h}k=a.M;i=a.D;var p=function(a){l=i[a]&&i[a][b];if(l){d=l[g];if(typeof d=='number')d=l[d]}};for(c=k.length;!d&&c--;){g=k[c];if(f)p(f);if(!d)p('*')}if(d){b=d}else if(j.forceMatch){return''}}b+='';if(!e.length||b.indexOf('%')==-1)return b;return b.replace(/%\{(\d+)\}/g,function(c,b){var a=e[+b];return a===undefined?'':a}).replace(/%s|%p|%\{.+?\}/g,function(){var a=e[r++];return a===undefined?'':a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

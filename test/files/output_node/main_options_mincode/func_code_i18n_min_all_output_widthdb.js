module.exports = function code()
{


	/* eslint-disable */
	function I18N(c,e,k){
		var a=I18N,m,l=0,i,j,h,g,f,b,n=a.$||(a.$={}),d=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(n);if(!e||!e.join){k=e;e=[]}if(d&&d.split){if(a.L!=d){a.K='*';a.V='df';a.D={};
		m=a.D;j=d.split(',');i=a.M=[];for(h=j.length;h--;){g=m[j[h]];if(g)i.push(g)}a.L=d}i=a.M;for(h=i.length;!f&&h--;){g=i[h];if(k){b=g.SUBTYPES;b=b&&b[k];f=b&&b[c]}if(!f){b=g.DEFAULTS;f=b&&b[c]}}if(f)c=f}c+='';if(!e.length||c.indexOf('%')==-1)return c;return c.replace(/%s|%\{.+?\}/g,function(b){var a=e[l++];return a===undefined?b:a===null?'':a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

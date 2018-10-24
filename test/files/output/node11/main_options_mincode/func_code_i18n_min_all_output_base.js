module.exports = function code()
{


	/* eslint-disable */
	function I18N(d,e,k){
		var a=I18N,p=a.$||(a.$={}),h,q=0,i,b,f,c,j,g=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!e||!e.join){k=e;e=[]}if(g&&g.split){if(a.L!=g){a.K='*';a.V='Hf';a.D={};
		h=a.D;var l=h.$||[],m={},n=g.split(',');i=a.M=[];for(b=l.length;b--;)m[l[b]]=b;for(b=n.length;b--;){f=m[n[b]];if(f||f===0)i.push(f)}a.L=g}i=a.M;h=a.D;var o=function(a){j=h[a]&&h[a][d];if(j){c=j[f];if(typeof c=='number')c=j[c]}};for(b=i.length;!c&&b--;){f=i[b];if(k)o(k);if(!c)o('*')}if(c)d=c}d+='';if(!e.length||d.indexOf('%')==-1)return d;return d.replace(/%s|%\{.+?\}/g,function(){var a=e[q++];return a===undefined?'':a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

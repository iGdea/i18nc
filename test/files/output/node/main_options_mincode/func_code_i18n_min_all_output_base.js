module.exports = function code()
{


	/* eslint-disable */
	function I18N(e,d,k){
		var a=I18N,q=a.$||(a.$={}),h,p=0,i,b,f,c,j,g=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(q);if(!d||!d.join){k=d;d=[]}if(g&&g.split){if(a.L!=g){a.K='*';a.V='If';a.D={};
		h=a.D;var o=h.$||[],l={},n=g.split(',');i=a.M=[];for(b=o.length;b--;)l[o[b]]=b;for(b=n.length;b--;){f=l[n[b]];if(f||f===0)i.push(f)}a.L=g}i=a.M;h=a.D;var m=function(a){j=h[a]&&h[a][e];if(j){c=j[f];if(typeof c=='number')c=j[c]}};for(b=i.length;!c&&b--;){f=i[b];if(k)m(k);if(!c)m('*')}if(c)e=c}e+='';if(!d.length||e.indexOf('%')==-1)return e;return e.replace(/%s|%p|%\{.+?\}/g,function(){var a=d[p++];return a===undefined?'':a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

module.exports = function code()
{


	/* eslint-disable */
	function I18N(b,e,k){
		if(!b)return b===undefined||b===null?'':''+b;var a=I18N,p=a.$||(a.$={}),h,q=0,i,c,f,d,j,g=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!e||!e.join){k=e;e=[]}if(g&&g.split){if(a.L!=g){a.K='*';a.V='If';a.D={
			'*': {
				// '简体':
			}
		};
		h=a.D;var l=h.$||[],m={},n=g.split(',');i=a.M=[];for(c=l.length;c--;)m[l[c]]=c;for(c=n.length;c--;){f=m[n[c]];if(f||f===0)i.push(f)}a.L=g}i=a.M;h=a.D;var o=function(a){j=h[a]&&h[a][b];if(j){d=j[f];if(typeof d=='number')d=j[d]}};for(c=i.length;!d&&c--;){f=i[c];if(k)o(k);if(!d)o('*')}if(d)b=d}b+='';if(!e.length||b.indexOf('%')==-1)return b;return b.replace(/%s|%p|%\{.+?\}/g,function(){var a=e[q++];return a===undefined?'':a})
	}
	/* eslint-enable */



	var v1 = I18N('简体');
}

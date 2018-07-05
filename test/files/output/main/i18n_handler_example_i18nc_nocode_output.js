module.exports = function I18N(c,e,l){
	var a=I18N;var p=a.$||(a.$={});var d=(function(){return global.__i18n_lan__})(p);if(!e||!e.join){l=e;e=[]}if(d&&d.split){var g,b,h,f;if(a.L!=d){a.K='i18n_handler_example';a.V='b';a.D={};
	var r=a.D;var k=d.split(',');g=a.M=[];for(b=0,h=k.length;b<h;b++){f=r[k[b]];if(f)g.push(f)}a.L=d}g=a.M;var j,i,m,n,o;for(b=0,h=g.length;b<h;b++){f=g[b];if(l){m=f.SUBTYPES;o=m&&m[l];i=o&&o[c];if(i)break}if(!j){n=f.DEFAULTS;j=n&&n[c]}}if(i)c=i;else if(j)c=j}if(!e.length)return''+c;var q=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=e[q++];return a===undefined||a===null?b:a})
}

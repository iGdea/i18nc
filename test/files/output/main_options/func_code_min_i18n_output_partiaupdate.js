function I18N(d,f,k){
	var a=I18N;var p=a.data||(a.data={});var e=(function(){return global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='i18n_handler_example';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={'en-US':{'DEFAULTS':{'%s美好%s生活':'%sgood%s life','%{中文}词典':'%{Chinese} dictionary','空白':[],'简体':'simplified'}},'zh-TW':{'DEFAULTS':{'简体':'簡體'}}};
	var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
}
var codeJSON={
	"DEFAULTS": [
		I18N('简体'),
		I18N('空白'),
		I18N('%s美好%s生活'),
		I18N('%{中文}词典')
	]
}
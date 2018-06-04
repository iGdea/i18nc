function I18N(h,f,i){
	/*eslint-disable*/
	var a=I18N;if(!a.data)a.data={};var d=(function(){return global.__i18n_lan__})(a.data);if(!f||!f.join){i=f;f=[]}if(d){if(a.__TRANSLATE_LAN__!=d){a.__FILE_KEY__='i18n_handler_example';a.__FUNCTION_VERSION__='8';a.__TRANSLATE_JSON__={'en-US':{'DEFAULTS':{'%s美好%s生活':'%sgood%s life','%{中文}词典':'%{Chinese} dictionary','空白':[],'简体':'simplified'}},'zh-TW':{'DEFAULTS':{'简体':'簡體'}}};
	var o=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_ITEMS__=[];if(d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=o[j[b]];if(c)e.push(c)}}a.__TRANSLATE_LAN__=d}var e=a.__TRANSLATE_ITEMS__;var k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h]}var n=l||k;if(n)h=n}var p=0;return(''+h).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a});
	/*eslint-enable*/
}
var codeJSON={
	"DEFAULTS": [
		I18N('简体'),
		I18N('空白'),
		I18N('%s美好%s生活'),
		I18N('%{中文}词典')
	]
}
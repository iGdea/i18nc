module.exports = function code()
{
	var word = I18N('中文db *');
	console.log(word, I18N('中文2'));

	function I18N(g,h,i){var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window == "object" ? window : typeof global == "object" && global)||{};var d=o.__i18n_lan__;if(!d)return g;if(!h.slice){i=h;h=[]}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='3';a.__TRANSLATE_JSON__=require("./require_data.js")
	;var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,f=j.length;b<f;b++){var c=n[j[b]];if(c)e.push(c)}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,f=e.length;b<f;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[g];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[g]}var q=l||k||g;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=h[p++];return a===undefined||a===null?'':a})}
}
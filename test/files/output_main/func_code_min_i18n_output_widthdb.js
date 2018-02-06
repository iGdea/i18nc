;(function(){


function I18N(h,f,i){var a=I18N;var o=a.__GLOBAL__||(a.__GLOBAL__=typeof window=='object'?window:typeof global=='object'&&global)||{};var d=o.__i18n_lan__;if(!d)return h;if(!f||!f.slice){i=f;f=[];}if(a.__TRANSLATE_LAN__!=d){a.__TRANSLATE_LAN__=d;a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='5';a.__TRANSLATE_JSON__={};var n=a.__TRANSLATE_JSON__;var e=a.__TRANSLATE_LAN_JSON__=[];if(d&&d.split){var j=d.split(',');for(var b=0,g=j.length;b<g;b++){var c=n[j[b]];if(c)e.push(c);}}}var e=a.__TRANSLATE_LAN_JSON__,k,l;for(var b=0,g=e.length;b<g;b++){var c=e[b];var m=i&&c.SUBTYPES&&c.SUBTYPES[i];l=m&&m[h];if(l)break;if(!k)k=c.DEFAULTS&&c.DEFAULTS[h];}var q=l||k||h;var p=0;return(''+q).replace(/(%s)|(%\{(.+?)\})/g,function(){var a=f[p++];return a===undefined||a===null?'':a;});}

function code()
				{
					var v1 = I18N('简体');
				}
})();
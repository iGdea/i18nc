module.exports = function code()
{


	/* eslint-disable */
	function I18NNew(d,f,k){
		var a=I18NNew;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
			'en-US': {
				'DEFAULTS': {
					// 'argv中文':
					// 'print信息，':
					// '中午true':
					// '中文0':
					// '中文1':
					// '中文I18N':
					// '中文case':
					// '中文false':
					// '中文if':
					// '中文key':
					// '中文val':
					// '中文val in object':
					// '简体':
					'<e.g.> translate word': null
				},
				'SUBTYPES': {
					'subtype': {
						// 'I18N(中文)':
						// '中文I18N subtype':
						'<e.g.> translate word': null
					},
					'subtype2': {
						// 'I18N(中文)':
						'<e.g.> translate word': null
					}
				}
			}
		};
		var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
	}
	/* eslint-enable */



	var result;       // 中文注释
	result = I18NNew('中文0');
	result += I18NNew('中文1')+1;

	var c5 = {
		'中文key in object': I18NNew('中文val in object'),
	};
	c5[I18NNew('中文key')] = I18NNew('中文val');
	result += c5[I18NNew('中文key')];

	function print(msg) {
		return I18NNew('print信息，') + msg;
	}

	// 中文注释
	result += print(I18NNew('argv中文'));     // 中文注释

	function switch_print(name)
	{
		switch(name)
		{
			case I18NNew('中文case'):
			result += name;
			break;
		}
	}

	switch_print(I18NNew('中文case'));

	if (I18NNew('中文if'))
	{
		result += true ? I18NNew('中午true') : I18NNew('中文false')
	}

	I18N('中文I18N');
	I18N('中文I18N subtype', 'subtype');

	// I18N
	function I18NNew(d,f,k){
		var a=I18NNew;var p=a.data||(a.data={});var e=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!f||!f.join){k=f;f=[]}if(e&&e.split){var g,b,h,c;if(a.__TRANSLATE_LAN__!=e){a.__FILE_KEY__='*';a.__FUNCTION_VERSION__='a';a.__TRANSLATE_JSON__={
			'en-US': {
				'DEFAULTS': {
					// 'argv中文':
					// 'print信息，':
					// '中午true':
					// '中文0':
					// '中文1':
					// '中文I18N':
					// '中文case':
					// '中文false':
					// '中文if':
					// '中文key':
					// '中文val':
					// '中文val in object':
					// '简体':
					'<e.g.> translate word': null
				},
				'SUBTYPES': {
					'subtype': {
						// 'I18N(中文)':
						// '中文I18N subtype':
						'<e.g.> translate word': null
					},
					'subtype2': {
						// 'I18N(中文)':
						'<e.g.> translate word': null
					}
				}
			}
		};
		var o=a.__TRANSLATE_JSON__;var l=e.split(',');g=a.__TRANSLATE_ITEMS__=[];for(b=0,h=l.length;b<h;b++){c=o[l[b]];if(c)g.push(c)}a.__TRANSLATE_LAN__=e}g=a.__TRANSLATE_ITEMS__;var m,i,j;for(b=0,h=g.length;b<h;b++){c=g[b];m=k&&c.SUBTYPES&&c.SUBTYPES[k];j=m&&m[d];if(j)break;if(!i)i=c.DEFAULTS&&c.DEFAULTS[d]}if(j)d=j;else if(i)d=i}if(!f.length)return''+d;var n=0;return(''+d).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=f[n++];return a===undefined||a===null?b:a})
	}

	result += I18N('I18N(中文)', 'subtype');
	result += I18N('I18N(中文)', 'subtype2');
	result += I18N('简体');

	return result;
}
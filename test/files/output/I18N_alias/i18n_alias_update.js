module.exports = function code()
{
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

	I18NNew('中文I18N');
	I18NNew('中文I18N subtype', 'subtype');

	// I18N
	function I18NNew(c,e,l){
		var a=I18NNew;var p=a.$||(a.$={});var d=(function(a){if(!a.global){a.global=typeof window=='object'&&window||typeof global=='object'&&global||{}}return a.global.__i18n_lan__})(p);if(!e||!e.join){l=e;e=[]}if(d&&d.split){var g,b,h,f;if(a.L!=d){a.K='*';a.V='b';a.D={
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
		var r=a.D;var k=d.split(',');g=a.M=[];for(b=0,h=k.length;b<h;b++){f=r[k[b]];if(f)g.push(f)}a.L=d}g=a.M;var j,i,m,n,o;for(b=0,h=g.length;b<h;b++){f=g[b];if(l){m=f.SUBTYPES;o=m&&m[l];i=o&&o[c];if(i)break}if(!j){n=f.DEFAULTS;j=n&&n[c]}}if(i)c=i;else if(j)c=j}if(!e.length)return''+c;var q=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(b){var a=e[q++];return a===undefined||a===null?b:a})
	}

	result += I18NNew('I18N(中文)', 'subtype');
	result += I18NNew('I18N(中文)', 'subtype2');
	result += I18NNew('简体');

	return result;
}

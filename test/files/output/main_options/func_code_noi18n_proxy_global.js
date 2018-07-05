module.exports = function code()
{


	/* eslint-disable */
	function I18N(c){
		var a=I18N;var b=a.$;if(!b){b=a.$={};a.K='*';a.V='b.g';a.D={
			'en-US': {
				'DEFAULTS': {
					// '中文':
					// '中文2':
					'<e.g.> translate word': null
				}
			}
		}
		}return''+topI18N(c,arguments,a.D,a.K,b,a)
	}
	/* eslint-enable */



	var word = I18N('中文');
	consol.log(word, I18N('中文2'));
}

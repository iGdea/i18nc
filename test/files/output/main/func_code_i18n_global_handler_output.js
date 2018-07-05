module.exports = function code()
{
	var word = I18N('中文');
	function I18N(c){
		var a=I18N;var b=a.$;if(!b){b=a.$={};a.K='*';a.V='b.g';a.D={
			'en-US': {
				'DEFAULTS': {
					// '中文':
					'<e.g.> translate word': null
				}
			}
		}
		}return''+window.topI18N(c,arguments,a.D,a.K,b,a)
	}
}
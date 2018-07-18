module.exports = function code()
{
	var word = I18N('中文');
	function I18N(msg)
	{
		var self = I18N;
		var data = self.$;
	
		if (!data)
		{
			data = self.$ = {};
			self.K = '*';
			self.V = 'b.g';
			self.D = {
				'en-US': {
					'DEFAULTS': {
						// '中文':
						'<e.g.> translate word': null
					}
				}
			};
		}
	
		return ''+topI18N2(msg, arguments, self.D, self.K, data, self);
	}
}

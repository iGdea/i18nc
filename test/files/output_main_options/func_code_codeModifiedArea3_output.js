module.exports = function code()
{
	var result;       // 中文注释
	result = "中文0";
	result += "中文1"+1;

	var c5 = {
		'中文key in object': '中文val in object',
	};
	c5['中文key'] = '中文val';
	result += c5['中文key'];

	function print(msg) {
		return 'print信息，' + msg;
	}

	// 中文注释
	result += print('argv中文');     // 中文注释

	function switch_print(name)
	{
		switch(name)
		{
			case '中文case':
			result += name;
			break;
		}
	}

	switch_print('中文case');

	if ('中文if')
	{
		result += true ? '中午true' : '中文false'
	}

	I18N('中文I18N');
	I18N('中文I18N subtype', 'subtype');

	// I18N
	function I18N(msg){return msg}

	result += I18N('I18N(中文)', 'subtype');
	result += I18N('I18N(中文)', 'subtype2');
	result += I18N('简体');

	return result;
}

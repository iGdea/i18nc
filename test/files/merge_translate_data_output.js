module.exports = {
	'zh': {
		'DEFAULTS': {
			'中文0': 'indb <thisfile> db2',
			'中文1': 'in_file custom1' || 'in_file zh1',
			'中文2': 'in_file zh2_db' || '' || 'in_file zh2',
			'中文3_empty': [] || '',
			'中文5_empty': [] || '',
			'中文6_empty': 'in_file 4' || 'in_file 3' || 'in_file 2' || 'in_file 1',
			'中文db <allfile>': 'in file <allfile>' || ''
		},
		'SUBTYPES': {
			'subtype': {
				'中文 allfile subtype1': 'in_file allfile subtype1' || '',
				'中文 thisfile subtype2': 'indb <thisfile> subtype2',
				'中文0': 'in_file subtye_zh0' || '',
				'中文1': 'in_file ubtye_custom1' || 'in_file subtye_zh1',
				'中文2': 'in_file subtye_zh2_db' || '' || 'in_file subtye_zh2',
				'中文3_empty': [] || ''
			}
		}
	}
}
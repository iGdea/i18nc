var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var DEF = require('../lib/def');
var i18nTpl = require('../lib/i18n_function_tpl');

function i18n_handler_example()
{
	var TRANSLATE_JSON =
	{
		"en-US":
		{
			"DEFAULTS":
			{
				'中文0': 'in_file zh0',
				'中文1': 'in_file custom1',
				'中文2': 'in_file zh2_db',

				'中文3_empty': '',
				'中文4_empty': '',
				'中文5_empty': [],
				'中文6_empty': 'in_file 4',

				'中文db *': 'in file *'
			},
			"SUBTYPES":
			{
				'subtype':
				{
					'中文0': 'in_file subtye_zh0',
					'中文1': 'in_file ubtye_custom1',
					'中文2': 'in_file subtye_zh2_db',
					'中文3_empty': '',
					'中文 allfile subtype1': 'in_file allfile subtype1',
					'中文 thisfile subtype2': 'in_file thisfile subtype2',
				}
			}
		},
		"zh-TW":
		{
			"DEFAULTS":
			{
				'中文0': '中文0 in tw'
			}
		}
	};

	var content = 'module.exports = I18N;\n';
	content += i18nTpl.render(
		{
			handlerName			: 'I18N',
			FILE_KEY			: 'i18n_handler_example',
			FUNCTION_VERSION	: DEF.I18NFunctionVersion,
			GetGlobalCode		: 'typeof window == "object" ? window : typeof global == "object" && global',
			LanguageVarName		: '__i18n_lan__',
			TRANSLATE_JSON		: JSON.stringify(TRANSLATE_JSON, null, '\t').replace(/\n/g, '\n\t'),
		});

	return fs.writeFileAsync(__dirname+'/files/i18n_handler_example.js', content);
}


function main()
{
	return Promise.all(
		[
			i18n_handler_example()
		]);
}

main();

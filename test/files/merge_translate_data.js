var funcInfo = require('./i18n_handler_example_output.json');

module.exports =
{
	FILE_KEY			: funcInfo.__FILE_KEY__,
	funcTranslateWords	: funcInfo.__TRANSLATE_JSON__,
	dbTranslateWords:
	{
		zh:
		{
			normal:
			{
				DEFAULTS:
				{
					'中文1': 'db1'
				},
				SUBTYPES:
				{}
			},
			'I am a __FILE_KEY__':
			{
				DEFAULTS:
				{
					'中文0': ['db1', 'custom', 'db2']
				},
				SUBTYPES:
				{}
			}
		}
	},

	// test/example/example_code_output_code.json
	codeTranslateWords:
	{
		DEFAULTS: ["中文0", "中文1", "中文2", "中文3_empty"],
		SUBTYPES:
		{
			subtype: ["中文0", "中文1", "中文2", "中文3_empty"]
		}
	},
};

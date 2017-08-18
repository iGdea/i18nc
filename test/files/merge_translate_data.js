var funcInfo = require('./i18n_handler_example_output.json');

module.exports =
{
	FILE_KEY			: funcInfo.__FILE_KEY__,
	funcTranslateWords	: funcInfo.__TRANSLATE_JSON__,

	dbTranslateWords	: require('../example/translate_words_db.json'),

	// test/example/example_code_output_code.json
	codeTranslateWords:
	{
		DEFAULTS: ["中文0", "中文1", "中文2", "中文3_empty", "中文4_empty", "中文5_empty"],
		SUBTYPES:
		{
			subtype: ["中文0", "中文1", "中文2", "中文3_empty"]
		}
	},
};

var funcInfo = require('./casefile/i18n_handler/i18n_handler_example_output.json');
var translateJSON = funcInfo.__TRANSLATE_JSON__;

module.exports =
{
	FILE_KEY			: funcInfo.__FILE_KEY__,
	funcTranslateWords	: translateJSON,

	dbTranslateWords	: require('../example/translate_words_db.json'),

	// test/example/example_code_output_code.json
	codeTranslateWords:
	{
		DEFAULTS: Object.keys(translateJSON['en-US'].DEFAULTS),
		SUBTYPES:
		{
			subtype: Object.keys(translateJSON['en-US'].SUBTYPES.subtype)
		}
	},
};

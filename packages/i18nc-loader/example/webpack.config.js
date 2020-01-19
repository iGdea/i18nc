'use strict';

const path = require('path');

module.exports = {
	entry: {
		input: path.join(__dirname, 'src', 'input.js')
	},
	output: {
		path: path.join(__dirname, '../test/tmp'),
		filename: '[name].js',
		library: 'i18nc',
		libraryTarget: 'umd'
	},
	devtool: 'source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: require.resolve('../'),
						options: {
							I18NHandlerName: 'weLANG',
							dbTranslateWords: {
								version: 2,
								data: {
									'*': {
										'en-US': {
											DEFAULTS: {
												中文: 'zh'
											}
										}
									}
								}
							}
						}
					}
				]
			}
		]
	}
};

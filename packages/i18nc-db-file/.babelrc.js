module.exports =
{
	presets:
	[
		[
			'@babel/preset-env',
			{
				// targets:
				// {
				// 	node: '0.12'
				// }
			}
		]
	],
	plugins:
	[
		[
			'@babel/plugin-transform-runtime',
			{
				// regenerator: true
			}
		]
	]
};

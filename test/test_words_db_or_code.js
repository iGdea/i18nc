var expect		= require('expect.js');
var chooseWord	= require('../lib/words_db_or_code').choose;


describe('#chooseWord', function()
{
	function _genIt(funcTranslateWord, results)
	{
		describe('#func_len'+funcTranslateWord.length, function()
		{
			[
				[],
				['db custom1'],
				['db custom1', 'db1'],
				['db custom1', 'db1', 'db custom2']
			]
			.forEach(function(dbFileKeyTranslate, index)
			{
				it('#result_index_'+index, function()
				{
					var result = chooseWord(funcTranslateWord, dbFileKeyTranslate);
					expect(result).to.eql(results[index]);
				});
			});
		});
	}

	describe('#all diff', function()
	{
		_genIt([],
		[
			[],
			['db custom1'],
			['db custom1', 'db1'],
			['db custom1', 'db1']
		]);

		_genIt(['func custom1'],
		[
			['func custom1'],
			['func custom1'],
			['func custom1', 'db1'],
			['func custom1', 'db1']
		]);

		_genIt(['func custom1', 'func1'],
		[
			['func custom1'],
			['func custom1'],
			['func custom1', 'db1'],
			['func custom1', 'db1']
		]);

		_genIt(['func custom1', 'func1', 'func custom2'],
		[
			['func custom1', 'func1', 'func custom2'],
			['func custom1', undefined, 'func custom2'],
			['func custom1', 'db1', 'func custom2'],
			['func custom1', 'db1', 'func custom2']
		]);

		_genIt(['func custom1', 'func1', 'func custom2', 'func custom3'],
		[
			['func custom1', 'func1', 'func custom3'],
			['func custom1', undefined, 'func custom3'],
			['func custom1', 'db1', 'func custom3'],
			['func custom1', 'db1', 'func custom3']
		]);
	});

	describe('#same 1', function()
	{
		_genIt(['db custom1'],
		[
			['db custom1'],
			['db custom1'],
			['db custom1', 'db1'],
			['db custom1', 'db1'],
		]);

		_genIt(['db custom1', 'func1'],
		[
			['db custom1'],
			['db custom1'],
			['db custom1', 'db1'],
			['db custom1', 'db1'],
		]);

		_genIt(['db custom1', 'func1', 'func custom2'],
		[
			['db custom1', 'func1', 'func custom2'],
			['db custom1', undefined, 'func custom2'],
			['db custom1', 'db1', 'func custom2'],
			['db custom1', 'db1', 'func custom2']
		]);

		_genIt(['db custom1', 'func1', 'func custom2', 'func custom3'],
		[
			['db custom1', 'func1', 'func custom3'],
			['db custom1', undefined, 'func custom3'],
			['db custom1', 'db1', 'func custom3'],
			['db custom1', 'db1', 'func custom3']
		]);
	});


	describe('#same 2', function()
	{
		_genIt(['func custom1', 'db1'],
		[
			['func custom1'],
			['func custom1'],
			['func custom1', 'db1'],
			['func custom1', 'db1']
		]);

		_genIt(['func custom1', 'db1', 'func custom2'],
		[
			['func custom1', 'db1', 'func custom2'],
			['func custom1', undefined, 'func custom2'],
			['func custom1', 'db1', 'func custom2'],
			['func custom1', 'db1', 'func custom2']
		]);

		_genIt(['func custom1', 'db1', 'func custom2', 'func custom3'],
		[
			['func custom1', 'db1', 'func custom3'],
			['func custom1', undefined, 'func custom3'],
			['func custom1', 'db1', 'func custom3'],
			['func custom1', 'db1', 'func custom3']
		]);
	});

	describe('#same 3', function()
	{
		_genIt(['func custom1', 'func1', 'db custom2'],
		[
			['func custom1', 'func1', 'db custom2'],
			['func custom1', undefined, 'db custom2'],
			['func custom1', 'db1', 'db custom2'],
			['func custom1', 'db1', 'db custom2']
		]);

		_genIt(['func custom1', 'func1', 'db custom2', 'func custom3'],
		[
			['func custom1', 'func1', 'func custom3'],
			['func custom1', undefined, 'func custom3'],
			['func custom1', 'db1', 'func custom3'],
			['func custom1', 'db1', 'func custom3']
		]);
	});


	describe('#same 1,2', function()
	{
		_genIt(['db custom1', 'db1'],
		[
			['db custom1'],
			['db custom1'],
			['db custom1', 'db1'],
			['db custom1', 'db1']
		]);

		_genIt(['db custom1', 'db1', 'func custom2'],
		[
			['db custom1', 'db1', 'func custom2'],
			['db custom1', undefined, 'func custom2'],
			['db custom1', 'db1', 'func custom2'],
			['db custom1', 'db1', 'func custom2']
		]);

		_genIt(['db custom1', 'db1', 'func custom2', 'func custom3'],
		[
			['db custom1', 'db1', 'func custom3'],
			['db custom1', undefined, 'func custom3'],
			['db custom1', 'db1', 'func custom3'],
			['db custom1', 'db1', 'func custom3']
		]);
	});

	describe('#same 2,3', function()
	{
		_genIt(['func custom1', 'db1', 'db custom2'],
		[
			['func custom1', 'db1', 'db custom2'],
			['func custom1', undefined, 'db custom2'],
			['func custom1', 'db1', 'db custom2'],
			['func custom1', 'db1', 'db custom2']
		]);

		_genIt(['func custom1', 'db1', 'db custom2', 'func custom3'],
		[
			['func custom1', 'db1', 'func custom3'],
			['func custom1', undefined, 'func custom3'],
			['func custom1', 'db1', 'func custom3'],
			['func custom1', 'db1', 'func custom3']
		]);
	});

	describe('#same 1,3', function()
	{
		_genIt(['db custom1', 'func1', 'db custom2'],
		[
			['db custom1', 'func1', 'db custom2'],
			['db custom1', undefined, 'db custom2'],
			['db custom1', 'db1', 'db custom2'],
			['db custom1', 'db1', 'db custom2']
		]);

		_genIt(['db custom1', 'func1', 'db custom2', 'func custom3'],
		[
			['db custom1', 'func1', 'func custom3'],
			['db custom1', undefined, 'func custom3'],
			['db custom1', 'db1', 'func custom3'],
			['db custom1', 'db1', 'func custom3']
		]);
	});

	describe('#same 1,2,3', function()
	{
		_genIt(['db custom1', 'db1', 'db custom2'],
		[
			['db custom1', 'db1', 'db custom2'],
			['db custom1', undefined, 'db custom2'],
			['db custom1', 'db1', 'db custom2'],
			['db custom1', 'db1', 'db custom2']
		]);

		_genIt(['db custom1', 'db1', 'db custom2', 'func custom3'],
		[
			['db custom1', 'db1', 'func custom3'],
			['db custom1', undefined, 'func custom3'],
			['db custom1', 'db1', 'func custom3'],
			['db custom1', 'db1', 'func custom3']
		]);
	});


	describe('#func_4 update', function()
	{
		_genIt(['func custom1', 'func1', 'db custom1'],
		[
			['func custom1', 'func1', 'db custom1'],
			['db custom1'],
			['db custom1', 'db1'],
			['db custom1', 'db1']
		]);
	});
});

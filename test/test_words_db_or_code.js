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
				['db1'],
				['db1', 'db custom'],
				['db1', 'db custom', 'db2'],
				['db1', 'db custom', 'db2', 'db custom2']
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
			undefined,
			['db1'],
			undefined,
			['db1', 'db custom', 'db2'],
			['db1', 'db custom', 'db2']
		]);

		_genIt(['func1'],
		[
			['', 'func1'],
			['db1'],
			['', 'func1'],
			['db2'],
			['db2']
		]);

		_genIt(['func1', 'func custom'],
		[
			['func1', 'func custom'],
			['func1', 'func custom', 'db1'],
			['func1', 'func custom'],
			['func1', 'func custom', 'db2'],
			['func1', 'func custom', 'db2']
		]);

		_genIt(['func1', 'func custom', 'func2'],
		[
			['func1', 'func custom', 'func2'],
			['func1', 'func custom', 'db1'],
			['func1', 'func custom'],
			['func1', 'func custom', 'db2'],
			['func1', 'func custom', 'db2']
		]);

		_genIt(['func1', 'func custom', 'func2', 'func custom2'],
		[
			['func1', 'func custom', 'func2', 'func custom2'],
			['func1', 'func custom', 'func2', 'func custom2'],
			['func1', 'func custom', 'func2', 'func custom2'],
			['func1', 'func custom', 'func2', 'func custom2'],
			['func1', 'func custom', 'func2', 'func custom2']
		]);

		_genIt(['func1', 'func custom', 'func2', 'func custom2', 'func custom3'],
		[
			['func1', 'func custom', 'func2', 'func custom3'],
			['func1', 'func custom', 'func2', 'func custom3'],
			['func1', 'func custom', 'func2', 'func custom3'],
			['func1', 'func custom', 'func2', 'func custom3'],
			['func1', 'func custom', 'func2', 'func custom3']
		]);
	});

	describe('#same 1', function()
	{
		_genIt(['db1'],
		[
			['', 'db1'],
			['db1'],
			undefined,
			['db2'],
			['db2']
		]);

		_genIt(['db1', 'func custom'],
		[
			['db1', 'func custom'],
			['db1', 'func custom'],
			['db1', 'func custom'],
			['db1', 'func custom', 'db2'],
			['db1', 'func custom', 'db2']
		]);

		_genIt(['db1', 'func custom', 'func2'],
		[
			['db1', 'func custom', 'func2'],
			['db1', 'func custom', 'func2'],
			['db1', 'func custom'],
			['db1', 'func custom', 'db2'],
			['db1', 'func custom', 'db2']
		]);

		_genIt(['db1', 'func custom', 'func2', 'func custom2'],
		[
			['db1', 'func custom', 'func2', 'func custom2'],
			['db1', 'func custom', 'func2', 'func custom2'],
			['db1', 'func custom', 'func2', 'func custom2'],
			['db1', 'func custom', 'func2', 'func custom2'],
			['db1', 'func custom', 'func2', 'func custom2']
		]);

		_genIt(['db1', 'func custom', 'func2', 'func custom2', 'func custom3'],
		[
			['db1', 'func custom', 'func2', 'func custom3'],
			['db1', 'func custom', 'func2', 'func custom3'],
			['db1', 'func custom', 'func2', 'func custom3'],
			['db1', 'func custom', 'func2', 'func custom3'],
			['db1', 'func custom', 'func2', 'func custom3']
		]);
	});


	describe('#same 2', function()
	{
		_genIt(['func1', 'db custom'],
		[
			['func1', 'db custom'],
			['func1', 'db custom', 'db1'],
			['func1', 'db custom'],
			['func1', 'db custom', 'db2'],
			['func1', 'db custom', 'db2']
		]);

		_genIt(['func1', 'db custom', 'func2'],
		[
			['func1', 'db custom', 'func2'],
			['func1', 'db custom', 'db1'],
			['func1', 'db custom'],
			['func1', 'db custom', 'db2'],
			['func1', 'db custom', 'db2']
		]);

		_genIt(['func1', 'db custom', 'func2', 'func custom2'],
		[
			['func1', 'db custom', 'func2', 'func custom2'],
			['func1', 'db custom', 'func2', 'func custom2'],
			['func1', 'db custom', 'func2', 'func custom2'],
			['func1', 'db custom', 'func2', 'func custom2'],
			['func1', 'db custom', 'func2', 'func custom2']
		]);

		_genIt(['func1', 'db custom', 'func2', 'func custom2', 'func custom3'],
		[
			['func1', 'db custom', 'func2', 'func custom3'],
			['func1', 'db custom', 'func2', 'func custom3'],
			['func1', 'db custom', 'func2', 'func custom3'],
			['func1', 'db custom', 'func2', 'func custom3'],
			['func1', 'db custom', 'func2', 'func custom3']
		]);
	});

	describe('#same 3', function()
	{
		_genIt(['func1', 'func custom', 'db2'],
		[
			['func1', 'func custom', 'db2'],
			['func1', 'func custom', 'db1'],
			['func1', 'func custom'],
			['func1', 'func custom', 'db2'],
			['func1', 'func custom', 'db2']
		]);

		_genIt(['func1', 'func custom', 'db2', 'func custom2'],
		[
			['func1', 'func custom', 'db2', 'func custom2'],
			['func1', 'func custom', 'db2', 'func custom2'],
			['func1', 'func custom', 'db2', 'func custom2'],
			['func1', 'func custom', 'db2', 'func custom2'],
			['func1', 'func custom', 'db2', 'func custom2']
		]);

		_genIt(['func1', 'func custom', 'db2', 'func custom2', 'func custom3'],
		[
			['func1', 'func custom', 'db2', 'func custom3'],
			['func1', 'func custom', 'db2', 'func custom3'],
			['func1', 'func custom', 'db2', 'func custom3'],
			['func1', 'func custom', 'db2', 'func custom3'],
			['func1', 'func custom', 'db2', 'func custom3']
		]);
	});


	describe('#same 1,2', function()
	{
		_genIt(['db1', 'db custom'],
		[
			['db1', 'db custom'],
			['db1', 'db custom'],
			['db1', 'db custom'],
			['db1', 'db custom', 'db2'],
			['db1', 'db custom', 'db2']
		]);

		_genIt(['db1', 'db custom', 'func2'],
		[
			['db1', 'db custom', 'func2'],
			['db1', 'db custom', 'func2'],
			['db1', 'db custom'],
			['db1', 'db custom', 'db2'],
			['db1', 'db custom', 'db2']
		]);

		_genIt(['db1', 'db custom', 'func2', 'func custom2'],
		[
			['db1', 'db custom', 'func2', 'func custom2'],
			['db1', 'db custom', 'func2', 'func custom2'],
			['db1', 'db custom', 'func2', 'func custom2'],
			['db1', 'db custom', 'func2', 'func custom2'],
			['db1', 'db custom', 'func2', 'func custom2']
		]);

		_genIt(['db1', 'db custom', 'func2', 'func custom2', 'func custom3'],
		[
			['db1', 'db custom', 'func2', 'func custom3'],
			['db1', 'db custom', 'func2', 'func custom3'],
			['db1', 'db custom', 'func2', 'func custom3'],
			['db1', 'db custom', 'func2', 'func custom3'],
			['db1', 'db custom', 'func2', 'func custom3']
		]);
	});

	describe('#same 2,3', function()
	{
		_genIt(['func1', 'db custom', 'db2'],
		[
			['func1', 'db custom', 'db2'],
			['func1', 'db custom', 'db1'],
			['func1', 'db custom'],
			['func1', 'db custom', 'db2'],
			['func1', 'db custom', 'db2']
		]);

		_genIt(['func1', 'db custom', 'db2', 'func custom2'],
		[
			['func1', 'db custom', 'db2', 'func custom2'],
			['func1', 'db custom', 'db2', 'func custom2'],
			['func1', 'db custom', 'db2', 'func custom2'],
			['func1', 'db custom', 'db2', 'func custom2'],
			['func1', 'db custom', 'db2', 'func custom2']
		]);

		_genIt(['func1', 'db custom', 'db2', 'func custom2', 'func custom3'],
		[
			['func1', 'db custom', 'db2', 'func custom3'],
			['func1', 'db custom', 'db2', 'func custom3'],
			['func1', 'db custom', 'db2', 'func custom3'],
			['func1', 'db custom', 'db2', 'func custom3'],
			['func1', 'db custom', 'db2', 'func custom3']
		]);
	});

	describe('#same 1,3', function()
	{
		_genIt(['db1', 'func custom', 'db2'],
		[
			['db1', 'func custom', 'db2'],
			['db1', 'func custom', 'db2'],
			['db1', 'func custom'],
			['db1', 'func custom', 'db2'],
			['db1', 'func custom', 'db2']
		]);

		_genIt(['db1', 'func custom', 'db2', 'func custom2'],
		[
			['db1', 'func custom', 'db2', 'func custom2'],
			['db1', 'func custom', 'db2', 'func custom2'],
			['db1', 'func custom', 'db2', 'func custom2'],
			['db1', 'func custom', 'db2', 'func custom2'],
			['db1', 'func custom', 'db2', 'func custom2']
		]);

		_genIt(['db1', 'func custom', 'db2', 'func custom2', 'func custom3'],
		[
			['db1', 'func custom', 'db2', 'func custom3'],
			['db1', 'func custom', 'db2', 'func custom3'],
			['db1', 'func custom', 'db2', 'func custom3'],
			['db1', 'func custom', 'db2', 'func custom3'],
			['db1', 'func custom', 'db2', 'func custom3']
		]);
	});

	describe('#same 1,2,3', function()
	{
		_genIt(['db1', 'db custom', 'db2'],
		[
			['db1', 'db custom', 'db2'],
			['db1', 'db custom', 'db2'],
			['db1', 'db custom'],
			['db1', 'db custom', 'db2'],
			['db1', 'db custom', 'db2']
		]);

		_genIt(['db1', 'db custom', 'db2', 'func custom2'],
		[
			['db1', 'db custom', 'db2', 'func custom2'],
			['db1', 'db custom', 'db2', 'func custom2'],
			['db1', 'db custom', 'db2', 'func custom2'],
			['db1', 'db custom', 'db2', 'func custom2'],
			['db1', 'db custom', 'db2', 'func custom2']
		]);

		_genIt(['db1', 'db custom', 'db2', 'func custom2', 'func custom3'],
		[
			['db1', 'db custom', 'db2', 'func custom3'],
			['db1', 'db custom', 'db2', 'func custom3'],
			['db1', 'db custom', 'db2', 'func custom3'],
			['db1', 'db custom', 'db2', 'func custom3'],
			['db1', 'db custom', 'db2', 'func custom3']
		]);

	});


	describe('#func_4 update', function()
	{
		_genIt(['db1', 'db custom', 'db2', 'db custom'],
		[
			['db1', 'db custom', 'db2', 'db custom'],
			['db1', 'db custom', 'db2', 'db custom'],
			['db1', 'db custom', 'db2', 'db custom'],
			['db1', 'db custom', 'db2'],
			['db1', 'db custom', 'db2']
		]);
	});
});

var debug = require('debug')('i18nc:translate_words_array_generator');

exports.choose = choose;
/**
 * 从funcTranslate和dbFileKeyTranslate中
 * 选择合适的数据，进行融合处理，返回最优翻译结果
 *
 * funcTranslate规则：
 * [init_db, custom, db, force_custom, ... force_custom]
 * 取四个值，arr[3]=arr.last
 *
 * dbFileKeyTranslate规则
 * [init_db, custom, db, ... dirty]
 * 只取前三个，之后为脏数据
 * [init_db, custom] 表示func扫描到db里面，但未初始化数据。其init_db没有实际意义
 * 						可能出现在否定了这个翻译导致的回退情况
 *
 * 【合并规则】
 * 默认以db为准
 * 但当funcTranslate len=4时，db的custom和func的force_custom一致才能替换
 */
function choose(funcTranslate, dbFileKeyTranslate)
{
	if (!funcTranslate)
	{
		funcTranslate = [];
	}
	else if (funcTranslate.length > 4)
	{
		// 如果超过4个，那么取最后第四个作为最终值
		var tmp = funcTranslate.slice(0, 3);
		tmp.push(funcTranslate[funcTranslate.length-1]);
		funcTranslate = tmp;
	}

	if (!dbFileKeyTranslate)
	{
		dbFileKeyTranslate = [];
	}
	else if (dbFileKeyTranslate.length > 3)
	{
		// 3之后的当作脏数据处理
		// db的数据可以统一维护，所以必须保证数据的正确性
		dbFileKeyTranslate = dbFileKeyTranslate.slice(0, 3);
	}


	if (funcTranslate.length && dbFileKeyTranslate.length)
	{
		switch(funcTranslate.length)
		{
			// 这里存在用户删除原来custom的行为
			case 1:
				// 如果dbFileKeyTranslate是2
				// 表示db中的数据可以忽略
				// 但还要考虑有没有可能是用户自定义数据的可能
				if (dbFileKeyTranslate.length == 2)
				{
					// 如果前后数据一致
					// 那么就是删除自定义操作
					if (funcTranslate[0] == dbFileKeyTranslate[0])
					{
						return;
					}
					// 如果不一致，那么就是升级操作
					else
					{
						return ['', funcTranslate[0]];
					}
				}
				else
				{
					// 如果用户删除原来的custom
					// 那么这里只需要返回一个
					return [ dbFileKeyTranslate[dbFileKeyTranslate.length-1] ];
				}
				break;

			case 2:

				switch(dbFileKeyTranslate.length)
				{
					case 1:
						if (dbFileKeyTranslate[0] != funcTranslate[0])
						{
							// 由于两边数据不一直，信任db
							var lanReuslt = funcTranslate.slice();
							lanReuslt.push(dbFileKeyTranslate[0]);
							return lanReuslt;
						}
						else
						{
							return funcTranslate;
						}
						break;

					case 2:
						return funcTranslate;
						break;

					case 3:
					default:
						var lanReuslt = funcTranslate.slice();
						lanReuslt.push(dbFileKeyTranslate[dbFileKeyTranslate.length-1]);
						return lanReuslt;
						break;
				}

				break;

			case 3:
				var lanReuslt = funcTranslate.slice(0, 2);

				// 如果dbFileKeyTranslate有3个
				// 可以不判断funcTranslate[0]，直接使用dbFileKeyTranslate[2]
				if (dbFileKeyTranslate.length%2)
				{
					lanReuslt[2] = dbFileKeyTranslate[dbFileKeyTranslate.length-1];
				}

				return lanReuslt;
				break;

			case 4:
				if (dbFileKeyTranslate.length == 3
					&& dbFileKeyTranslate[1] == funcTranslate[3])
				{
					return dbFileKeyTranslate;
				}
				else
				{
					return funcTranslate;
				}
				break;
		}
	}
	else if (funcTranslate.length)
	{
		// 只有1个值的时候
		// 对格式进行升级
		if (funcTranslate.length == 1)
		{
			return ['', funcTranslate[0]];
		}
		else
		{
			return funcTranslate;
		}
	}
	else if (dbFileKeyTranslate.length%2)
	{
		// 如果只有db中有
		// 那么输出完整的db数据
		// 不要只输出最后值
		// 原因：有可能是之前注释掉代码，导致某一次数据没有写入到code
		// return [ dbFileKeyTranslateLast ];
		return dbFileKeyTranslate;
	}
}

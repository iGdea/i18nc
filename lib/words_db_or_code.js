var debug = require('debug')('i18nc-core:words_db_or_code');

exports.choose = choose;
/**
 * 从funcTranslate和dbFileKeyTranslate中
 * 选择合适的数据，进行融合处理，返回最优翻译结果
 *
 * funcTranslate规则：
 * [custom, db, force_custom, ... force_custom]
 * 取3个值，arr[2]=arr.last
 *
 * dbFileKeyTranslate规则
 * [custom, db, ... dirty]
 * 只取前2个，之后为脏数据
 *
 * 【合并规则】
 * 默认以db为准
 * 但当funcTranslate len=3时，db的custom和func的force_custom一致才能替换
 */
function choose(funcTranslate, dbFileKeyTranslate)
{
	if (!funcTranslate)
	{
		funcTranslate = [];
	}
	else if (funcTranslate.length > 3)
	{
		// 如果超过3个，那么取最后一个作为最终值
		var tmp = funcTranslate.slice(0, 2);
		tmp.push(funcTranslate[funcTranslate.length-1]);
		funcTranslate = tmp;
	}

	if (!dbFileKeyTranslate)
	{
		dbFileKeyTranslate = [];
	}
	else if (dbFileKeyTranslate.length > 2)
	{
		// 2之后的当作脏数据处理
		// db的数据可以统一维护，所以必须保证数据的正确性
		dbFileKeyTranslate = dbFileKeyTranslate.slice(0, 2);
	}


	switch(funcTranslate.length)
	{
		case 0:
			// 如果只有db中有
			// 那么输出完整的db数据
			// 不要只输出最后值
			// 原因：有可能是之前注释掉代码，导致某一次数据没有写入到code
			// return [ dbFileKeyTranslateLast ];
			return dbFileKeyTranslate;

		case 1:
		case 2:
			if (dbFileKeyTranslate.length == 2)
			{
				return [funcTranslate[0], dbFileKeyTranslate[1]];
			}

			return [ funcTranslate[0] ];

		case 3:
			if (dbFileKeyTranslate.length > 0)
			{
				// 判断func的值是否相同
				// 只有相同才相信db的数据
				if (dbFileKeyTranslate[0] == funcTranslate[2])
				{
					return dbFileKeyTranslate;
				}
				else
				{
					return [funcTranslate[0], dbFileKeyTranslate[1], funcTranslate[2]];
				}
			}

			return funcTranslate;
	}
}

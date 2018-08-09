返回结果
=======

## DirtyWords(list)

### 成员方法

| 方法名             | 返回值      | 说明             |
|:------------------|:-----------|:----------------|
| toArray()         | Array      | 转换成数组        |
| toJSON()          | Object     | 输出JSON格式的结果 |
| clone()           | DirtyWords | 拷贝             |
| merge(dirtyWords) |            | 合并数据          |

## CodeTranslateWords(list)

### 成员方法

| 方法名                     | 返回值              | 说明                   |
|:--------------------------|:-------------------|:----------------------|
| toJSON()                  | Object             | 输出JSON格式的结果       |
| clone()                   | CodeTranslateWords | 拷贝                   |
| merge(codeTranslateWords) |                    | 合并数据                |
| allwords()                | String             | 输出所有需要翻译的词条    |
| list4newWordAsts()        | Ast                | 输出所有需要翻译的新的词条 |
| list4newWords()           | String             | 输出所有需要翻译的新的词条 |

## FileKeyTranslateWords(list)

### 成员方法

| 方法名                        | 返回值                 | 说明             |
|:-----------------------------|:----------------------|:----------------|
| toJSON()                     | Object                | 输出JSON格式的结果 |
| clone()                      | FileKeyTranslateWords | 拷贝             |
| merge(fileKeyTranslateWords) |                       | 合并数据          |
| lans()                       | Array                 | 输出解析到的语种   |

## TranslateWords(codeTranslateWords, funcTranslateWords, usedTranslateWords)

### 成员方法

| 方法名    | 返回值  | 说明             |
|:---------|:-------|:----------------|
| toJSON() | Object | 输出JSON格式的结果 |

## CodeInfoResult(data)

### 成员方法

| 方法名                   | 返回值                 | 说明                                |
|:------------------------|:----------------------|:-----------------------------------|
| toString()              | String                | 输出处理后的源码                      |
| toJSON()                | Object                | 输出JSON格式的结果                    |
| squeeze()               | CodeInfoResult        | 输出汇集所有子域结果后的最终结果         |
| allFuncLans()           | Array                 | 输出所有I18N函数解析结果中使用的翻译语种 |
| allUsedLans()           | Array                 | 输出所有当前使用的翻译语种              |
| allCodeTranslateWords() | CodeTranslateWords    | 输出所有源码中获取到的需要翻译的词组     |
| allFuncTranslateWords() | FileKeyTranslateWords | 输出所有I18N函数中解析到的翻译数据      |
| allUsedTranslateWords() | FileKeyTranslateWords | 输出所有正在使用的翻译数据              |
| allCurrentFileKeys()    | Array                 | 输出所有正在使用的FileKey             |
| allOriginalFileKeys()   | Array                 | 输出所有解析的FileKey                 |
| allDirtyWords()         | DirtyWords            | 输出所有无法处理的数据                 |

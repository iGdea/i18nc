module.exports = function code()
{
    var result = "";       // 中文注释
    result = "简体";
    result += "中文";
    result = {"中文key": 1};

    // I18N
	function I18N(){}

    result += I18N('简体', 'subtype1');
    result += I18N('简体', 'subtype2');

    return result;
}

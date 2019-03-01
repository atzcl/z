export default {
  /* tslint:disable */
  validator(rule, value, callback, source, options) {
    // 验证中国公民身份证的合法

    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    var code = value.substring(17);
    if(p.test(value)) {
        var sum = 0;
        for(var i=0;i<17;i++) {
            sum += value[i]*factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
            callback();
            return;
        }
    }

    callback('身份证号码不正确');
  },
};

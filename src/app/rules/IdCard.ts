/* eslint-disable max-params */

export default {
  validator(rule: any, value: any, callback: (message?: string) => void, source: any, options: any) {
    // 验证中国公民身份证的合法
    const exp = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/u;
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    const code = value.substring(17);
    if (exp.test(value)) {
      let sum = 0;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 17; i++) {
        sum += value[i] * factor[i];
      }

      if (parity[sum % 11] === code.toUpperCase()) {
        callback();
        return;
      }
    }

    callback('身份证号码不正确');
  },
};

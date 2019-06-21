export default {
  validator(rule: any, value: any, callback: (message?: string) => void, source: any, options: any) {
    // 验证手机号码
    // tslint:disable-next-line:max-line-length
    if ((/^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/).test(value)) {
      callback();
      return;
    }

    callback('手机号码不正确');
  },
};

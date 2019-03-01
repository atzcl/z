/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 context
|
*/

import * as AsyncValidator from 'async-validator';

const extendContext = {
  /**
   * 抛出自定义异常
   *
   * @param {number} code 错误状态码
   * @param {string} message 错误提示
   *
   * @throws {Error}
   */
  abort (code: number, message: string = 'error') {
    this.customException('AppFlowException', code, message);
  },

  validator(rules: object) {
    const validator = new AsyncValidator(rules);

    /**
     * todo: 到时候抽离成多语言文件
     * @see https://github.com/yiminghe/async-validator/blob/e782748f0345b462d84e96a582c0dd38db2de666/src/messages.js
     */
    const cn = {
      required: '%s 必填',
      types: {
        email: '%s 并不是正确格式的 %s',
      },
      string: {
        len: '%s 长度为 %s 位',
        min: '%s 长度最少要 %s 位',
        max: '%s 长度最大要 %s 位',
        range: '%s 长度为 %s ~ %s 位',
      },
    };
    // 挂载语言信息
    validator.messages(cn);

    return validator;
  },

  /**
   * async-validator validate
   *
   * @param  {Object} rules  - validate rule object, see [async-validator](https://github.com/yiminghe/async-validator)
   * @param  {Object} [data] - validate target, default to `this.request.body`
   * @param {object} options 当验证到有一个不通过的验证规则，那么就停止继续校验
   *
   * erroe info: [ { message: 'username 必填', field: 'username' }, { message: 'password 必填', field: 'password' } ]
   */
  validate(rules: object, verifyData?: object, options = { firstFields: true, first: true }) {
    this.validator(rules)
      .validate(
        verifyData || (this as any).request.body,
        options,
        (errors, fields) => {
          if (errors) {
            this.customException('ValidationException', 400, errors[0].message);
          }
        },
      );
  },

  /**
   * 抛出自定义异常
   *
   * @throws {string} exceptionName
   */
  customException(exceptionName: string, exceptionCode: number, exceptionMessage: string) {
    const error: any = new Error(exceptionMessage);
    error.status = exceptionCode;
    error.name = exceptionName;
    error.message = exceptionMessage;

    // 抛出验证异常给全局异常处理接管处理
    throw error;
  },
};

export default extendContext;

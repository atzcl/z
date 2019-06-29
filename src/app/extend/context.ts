/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 context
|
*/

import { Context } from 'egg';
import { AppFlowException } from '../exceptions/AppFlowException';

const extendContext = {
  /**
   * 当前 ctx 的 Request 对象, 主要是为了能避免使用 (this as any) 的写法
   *
   * @return {Request}
   */
  get self(): Context {
    return this as any;
  },

  /**
   * 抛出自定义异常
   *
   * @param {number} code 错误状态码
   * @param {string} message 错误提示
   *
   * @throws {Error}
   */
  abort(code: number, message: string = 'error') {
    throw new AppFlowException(message, code);
  },

  validate(rules: object, verifyData?: object, options = { firstFields: true, first: true }) {
    this.self.request.validate(rules, verifyData, options);
  },
};

export default extendContext;

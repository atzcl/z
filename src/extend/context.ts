/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 context
|
*/

module.exports = {
  /**
   * 抛出自定义异常
   *
   * @param {number} code 错误状态码
   * @param {string} message 错误提示
   * @throws {Error}
   */
  abort (code: number, message: string = 'error') {
    let error: any = new Error(message)
    error.status = code
    error.name = 'AppFlowException'

    throw error
  },
  /**
   * 覆写 egg-validate 的 validate，目的是为了使用自定义的异常名称 [ 可以在这里拓展下错误信息的自定义 ]
   *
   * @param  {Object} rules  - validate rule object, see [parameter](https://github.com/node-modules/parameter)
   * @param  {Object} [data] - validate target, default to `this.request.body`
   * errors: [ { message: 'required', field: 'name', code: 'missing_field' }, { message: 'required', field: 'password', code: 'missing_field' } ]
   */
  validate (rules: object, data?: object) {
    data = data || this.request.body
    const errors = this.app.validator.validate(rules, data)
    if (errors) {
      let error: any = new Error(`Validation Exception: [${errors[0].field}] ${errors[0].message}`)
      error.status = 422
      error.name = 'ValidationException'

      throw error
    }
  }
}

/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Auth 属下的验证
|
*/

import BaseValidate from '../../base_class/base_validate'

export default class auth extends BaseValidate {
  // login 请求验证
  public async login(): Promise<object> {
    let rule = {}

    // 根据不同的请求类型来返回不同的验证规则
    switch (this.ctx.request.method) {
      case 'POST':
        rule = {
          name: {
            required: true,
            type: 'string'
          },
          password: 'string'
        }
      case 'PUT':
      case 'GET':
      case 'DELETE':
    }

    return rule
  }
}
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Auth 属下的验证
|
*/

import BaseValidate from '../../base_class/base_validate'

export default class Category extends BaseValidate {
  public default (): object {
    let rule = {}

    // 根据不同的请求类型来返回不同的验证规则
    switch (this.ctx.request.method) {
      case 'POST':
      case 'PUT':
      case 'GET':
      case 'DELETE':
    }

    return rule
  }
}

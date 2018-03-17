/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Auth 属下的验证
|
*/

import BaseValidate from '../../base_class/base_validate'

export default class Auth extends BaseValidate {
  // 注册验证
  public register (): object {
    return {
      name: {
        required: true,
        type: 'string',
        min: 5,
        max: 32
      },
      password: {
        required: true,
        type: 'password',
        compare: 're-password'
      }
    }
  }

  public login (): object {
    return {
      name: {
        required: true,
        type: 'string',
        min: 5,
        max: 32
      },
      password: {
        required: true,
        type: 'password'
      }
    }
  }
}

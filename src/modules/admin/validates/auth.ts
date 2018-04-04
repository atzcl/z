/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Auth 属下的验证
|
*/

export default class Auth {
  // 注册验证
  register (): object {
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
  // 登录验证
  login (): object {
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

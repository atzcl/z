/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| Auth 属下的验证
|
*/

export default class AuthValidate {
  // 注册验证
  public register (): object {
    return {
      name: {
        required: true,
        type: 'string',
        min: 5,
        max: 32,
      },
      password: {
        required: true,
        type: 'password',
        compare: 're-password',
      },
    };
  }

  // 登录
  public login (): object {
    return {
      name: {
        required: true,
        type: 'string',
        min: 5,
        max: 32,
      },
      password: {
        required: true,
        type: 'password',
      },
    };
  }

  // 验证重置密码 url
  public restPassword (): object {
    return {
      name: {
        required: true,
        type: 'string',
      },
      email: {
        required: true,
        type: 'email',
      },
      token: {
        required: true,
        type: 'string',
      },
    };
  }

  // 重置更新密码
  public updatePassword (): object {
    return {
      name: {
        required: true,
        type: 'string',
      },
      password: {
        required: true,
        type: 'password',
        compare: 're-password',
      },
      email: {
        required: true,
        type: 'email',
      },
      token: {
        required: true,
        type: 'string',
      },
    };
  }

  // 发送重置密码邮件
  public sendPasswordRestMail (): object {
    return {
      email: {
        required: true,
        type: 'email',
      },
    };
  }
}

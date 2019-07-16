/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证类
|
*/

import { Context, provide, inject } from 'midway';

import { ValidationInterface } from '@/app/interfaces/Validation';
import PhoneRule from '@/app/rules/Phone';

@provide()
export class UserLoginValidate implements ValidationInterface {
  @inject()
  ctx!: Context;

  /**
   * 验证规则
   *
   * @return {object}
   */
  rules(ctx: Context) {
    const rules: any = {
      password: {
        required: true,
        type: 'string',
        min: 6,
        max: 64,
      },
    };

    // 根据登录类型，来返回验证条件
    switch (ctx.request.body.login_type) {
      case 'email':
        rules.email = {
          required: true,
          type: 'email',
        };
        break;
      case 'phone':
        rules.phone = {
          required: true,
          type: 'string',
          ...PhoneRule,
        };
        break;
      default:
        rules.username = {
          required: true,
          type: 'string',
          min: 4,
          max: 64,
        };
    }

    return rules;
  }

  /**
   * 错误提示
   *
   * @return {object}
   */
  messages() {
    return {};
  }
}

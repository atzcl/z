/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| UserLogin
|
*/

import { provide } from 'midway';

import { BaseAuthService } from './BaseAuth';
import { UserAdminModel } from '../../Models/UserAdmin';

@provide()
export class UserAdminLoginService extends BaseAuthService {
  /**
   * 获取登录用户的模型
   *
   * @returns
   */
  getUserModel() {
    return UserAdminModel;
  }

  /**
   * 加密 token
   *
   * @param {object} encryptUserData 需要加密的用户数据
   *
   * @returns {string}
   */
  generateToken(encryptUserData: object) {
    const ctx = this.ctx;

    // 将加密的密钥设置为后台用户的密钥
    return ctx.helper.jwt({ secret: ctx.app.config.jwt.adminSecret }).create(encryptUserData);
  }
}

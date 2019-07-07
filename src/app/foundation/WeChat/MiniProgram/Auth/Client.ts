/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 获取小程序 session
|
*/

import BaseClient from '../../Kernel/BaseClient';

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.code2Session.html
 */

interface IResponseResult {
  session_key: string;
  openid: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

export class Client extends BaseClient {
  /**
   * 根据 code 获取对应 session
   *
   * @param {string} code js code
   *
   * @returns {IResponseResult}
   */
  async session(code: string): Promise<IResponseResult> {
    const params = {
      appid: this.config.mini_program.app_id,
      secret: this.config.mini_program.secret,
      js_code: code,
      grant_type: 'authorization_code',
    };

    return this.httpGet('sns/jscode2session', { params });
  }
}

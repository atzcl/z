/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 JWT 相关方法
|
*/

import BaseHandler from '../base_class/base_handler'

export default class Jwt extends BaseHandler {
  /**
   * 获取加密 token
   *
   * @param {object} sub token 的标识（默认为用户标识）
   */
  public async createJWT (sub: object): Promise<string> {
    return this.app.jwt.sign({ sub: sub }, this.app.config.jwt.secret)
  }

  /**
   * 获取 JWT 解密数据
   *
   * @param {string} $token JWT token
   * @return {any} Promise 对象
   */
  public async decodeJWT (token: string): Promise<any> {
    return this.app.jwt.decode(token)
  }
}
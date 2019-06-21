/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 控制器基类
|
*/

import { inject, Context, EggLogger } from 'midway';

export class BaseRequest {
  @inject()
  logger: EggLogger;

  @inject()
  ctx: Context;

  get config() {
    return this.ctx.app.config;
  }

  /**
   * @var {Request} Context#request
   */
  get request() {
    return this.ctx.request;
  }

  /**
   * @var {Response} Context#response
   */
  get response() {
    return this.ctx.response;
  }

  /**
   * 快捷获取解析 jwt 后的 payload 数据
   *
   * @param {string?} key
   */
  getJwtUserClaims(key?: string) {
    const jwtUserClaims = this.request.input('jwtUserClaims', {});

    return key ? (jwtUserClaims[key] || null) : jwtUserClaims;
  }
}

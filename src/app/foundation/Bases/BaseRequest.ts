/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 控制器基类
|
*/

import { inject, Context, EggLogger } from 'midway';


interface JwtUserClaims {
  id: string;
  username: string;
  application_platform_id: string;
}

export class BaseRequest {
  @inject()
  readonly ctx!: Context;

  @inject()
  readonly logger!: EggLogger;

  get app() {
    return this.ctx.app;
  }

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
  getJwtUserClaims<T extends keyof JwtUserClaims>(key?: T) {
    const jwtUserClaims = this.request._body('jwtUserClaims', {});

    return key
      ? (jwtUserClaims[key] || null)
      : jwtUserClaims;
  }

  /**
   * 快捷方法，将 user_application_platform_id 添加到数据源中
   *
   * @param {object?} data 数据源
   */
  addApplicationPlatformIdToDataSource(data?: object) {
    const { application_platform_id: user_application_platform_id } = this.getJwtUserClaims() as Partial<JwtUserClaims>;

    return { ...(data || this.request.all()), user_application_platform_id }
  }

  // 抛出异常
  abort(code: number, message = 'error') {
    this.ctx.abort(code, message);
  }
}

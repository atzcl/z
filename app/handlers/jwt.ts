/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 处理 JWT 相关方法
|
*/

import { createHash } from 'crypto';
import BaseHandler from './base_handler';

export default class Jwt extends BaseHandler {
  // 储存到缓存的前缀
  private cachePrefix: string = 'jwt.';

  /**
   * 获取加密 token
   *
   * @param {object} data token 的标识（默认为用户标识）
   */
  public async create (data: object): Promise<string> {
    const { app } = this;

    return app.jwt.sign({ sub: data }, app.config.jwt.secret, {
      expiresIn: app.config.jwt_extra.ttl * 60 * 60, // token 过期时间, 单位: 小时
    });
  }

  /**
   * 验证 token 是否有效
   *
   * @param token
   */
  public async verify (token: string) {
    // 获取解密成功的数据
    const result = await this.app.jwt.verify(token, this.app.config.jwt.secret, {
      clockTolerance: 30, // 检查 nbf (token 最早可用时间) 和 exp (token 过期时间) 声明时容忍的秒数，以处理不同服务器之间的小时钟差异
    });

    // 判断该 token 是否已被拉黑
    if (await this.verifyBlack(token)) {
      await this.ctx.abort(403, '无效的 token');
    }

    return result;
  }

  /**
   * 获取 JWT 解密数据
   *
   * @param {string} $token JWT token
   * @return {any} Promise 对象
   */
  public async decode (token: string): Promise<any> {
    return this.app.jwt.decode(token, { complete: true });
  }

  /**
   * 快速获取 sub 数据
   *
   * @param {string} $token JWT token
   */
  public async getSub (token: string) {
    const jwtData: any = await this.verify(token);

    return jwtData.sub;
  }

  /**
   * 拉黑 token，过期自动释放
   *
   * @param {string} $token JWT token
   */
  public async blackToken (token: string) {
    // 使用 MD5 加密下，防止 key 过长
    const key = createHash('md5').update(token).digest('hex');

    // 解密 token
    const jwtData = await this.decode(token);

    // 获取 token 失效时间
    const refreshTtl = jwtData.payload.iat + (this.app.config.jwt_extra.refresh_ttl * 60 * 60);

    // 获取储存到缓存的失效时间
    const refreshTtlTime = refreshTtl - Math.floor(new Date().getTime() / 1000);

    // 判断 token 是否已失效 [ 非过期 ]，如果是已失效，那么就没拉黑的必要
    if (refreshTtlTime < 0) {
      return true;
    }

    // 储存到缓存黑名单中去
    return this.ctx.handlers.cache.set(this.cachePrefix + key, 'black_success', refreshTtlTime);
  }

  /**
   * 判断 token 是否被拉黑
   *
   * @param {string} $token JWT token
   */
  public async verifyBlack (token: string): Promise<boolean> {
    // 使用 MD5 加密下，防止 key 过长
    const key = createHash('md5').update(token).digest('hex');

    // 返回获取该缓存
    return this.ctx.handlers.cache.has(this.cachePrefix + key);
  }

  /**
   * 刷新 token
   *
   * @param {string} $token JWT token
   */
  public async refresh (token: string) {
    // 先验证该 token 是否有效
    try {
      await this.verify(token);
    } catch (error) {
      // 如果 jwt 抛出的异常并不是 token 失效，那么就可以认定该 token 是非法的了
      if (error.name !== 'TokenExpiredError') {
        this.ctx.abort(422, '无效的 token');
      }
    }

    // 解密 token
    const jwtData = await this.decode(token);

    // 真正的失效时间，区别于过期时间 [ 即：即使 token 过期了，但是只要还是在失效时间的范围内，那么一样可以刷新 token ]
    // 用 token 签发时间，加上设置的失效时间（单位：小时）,得出真正的失效时间
    const refreshTtl = jwtData.payload.iat + (this.app.config.jwt_extra.refresh_ttl * 60 * 60);

    // 判断是否已失效
    if (refreshTtl < Math.floor(new Date().getTime() / 1000)) {
      this.ctx.abort(403, 'token 已失效');
    }

    // 签发新 token
    return this.create(jwtData.payload.sub);
  }
}

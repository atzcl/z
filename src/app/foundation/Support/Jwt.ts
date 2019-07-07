/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| jwt 相关
|
*/

import { EggAppConfig } from 'midway';
import Helper from '@app/extend/helper';
import CacheManager from '@/app/foundation/support/cache';

interface IJwt {
  /**
   *
   * @param payload datas. datas to be signed
   * @param secretOrPrivateKey secret key. string or { key, passphrase }
   * @param options jwt options。see more details in https://github.com/auth0/node-jsonwebtoken
   * @param callback callback
   */
  sign(
    payload: any,
    secretOrPrivateKey: string,
    options?: any,
    callback?: () => any,
  ): string;
  /**
   *
   * @param token jwt token.
   * @param secretOrPrivateKey secret key。string or { key, passphrase }
   * @param options jwt options。see more details in https://github.com/auth0/node-jsonwebtoken
   * @param callback callback
   */
  verify(
    token: any,
    secretOrPrivateKey: string,
    options?: any,
    callback?: () => any,
  ): string;
}

export default class JwtManager {
  // 储存到缓存的前缀
  private cachePrefix: string = 'jwt.';

  // jwt 实例
  private jwtInstance: IJwt;
  // jwt 配置
  private jwtConfig: EggAppConfig['jwt'];
  // 缓存实例
  private cacheInstance: CacheManager;

  constructor(jwt: IJwt, config: EggAppConfig['jwt'], cache: CacheManager) {
    this.cacheInstance = cache;
    this.jwtInstance = jwt;
    this.jwtConfig = config;
  }

  /**
   * 密钥
   *
   * @memberof Jwt
   * @returns {string}
   */
  get secret() {
    return this.jwtConfig.secret;
  }

  /**
   * 刷新有限期，单位：小时
   *
   * @readonly
   * @memberof Jwt
   */
  get refreshTtl() {
    return this.jwtConfig.extras.refresh_ttl * 60 * 60;
  }

  /**
   * 过期时间，单位：小时
   *
   * @readonly
   * @memberof Jwt
   */
  get ttl() {
    return this.jwtConfig.extras.ttl * 60 * 60;
  }

  /**
   * 抛出 jwt 异常
   *
   * @param {number} code
   * @param {string} message
   * @memberof Jwt
   */
  jwtException(code: number, message: string) {
    const error: any = new Error(message);
    error.status = code;
    error.name = 'jwtException';

    throw error;
  }

  /**
   * 获取加密 token
   *
   * @param {any} data token 的标识（默认为用户标识）
   *
   * @returns {string}
   */
  public async create(data: any): Promise<string> {
    return this.jwtInstance.sign({ customClaims: data }, this.secret, {
      expiresIn: this.ttl, // token 过期时间, 单位: 小时
    });
  }

  /**
   * 验证 token 是否有效
   *
   * @param token
   */
  public async verify(token: string) {
    // 获取解密成功的数据
    const result = await this.jwtInstance.verify(token, this.secret, {
      clockTolerance: 30, // 检查 nbf (token 最早可用时间) 和 exp (token 过期时间) 声明时容忍的秒数，以处理不同服务器之间的小时钟差异
    });

    // 判断该 token 是否已被拉黑
    if (await this.verifyBlack(token)) {
      this.jwtException(403, '无效的 token');
    }

    return result;
  }

  /**
   * 快速获取 payload 数据
   *
   * @param {string} $token JWT token
   */
  public async getCustomClaims(token: string) {
    const jwtData: any = await this.verify(token);

    return jwtData.customClaims;
  }

  /**
   * 拉黑 token，过期自动释放
   *
   * @param {string} $token JWT token
   */
  public async blackToken (token: string) {
    // 解密 token
    const jwtData: any = await this.verify(token);

    // 使用 MD5 加密下，防止 key 过长
    const key = Helper.generateMD5(token);

    // 获取 token 失效时间
    const refreshTtl = jwtData.payload.iat + this.refreshTtl;

    // 获取储存到缓存的失效时间
    const refreshTtlTime = refreshTtl - Math.floor(new Date().getTime() / 1000);

    // 判断 token 是否已失效 [ 非过期 ]，如果是已失效，那么就没拉黑的必要
    if (refreshTtlTime < 0) {
      return true;
    }

    // 储存到缓存黑名单中去
    return this.cacheInstance.set(this.cachePrefix + key, '', refreshTtlTime);
  }

  /**
   * 判断 token 是否被拉黑
   *
   * @param {string} $token JWT token
   */
  public async verifyBlack (token: string): Promise<boolean> {
    // 使用 MD5 加密下，防止 key 过长
    const key = Helper.generateMD5(token);

    // 返回获取该缓存
    return this.cacheInstance.has(this.cachePrefix + key);
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
        this.jwtException(422, '无效的 token');
      }
    }

    // 解密 token
    const jwtData: any = await this.verify(token);

    // 真正的失效时间，区别于过期时间 [ 即：即使 token 过期了，但是只要还是在失效时间的范围内，那么一样可以刷新 token ]
    // 用 token 签发时间，加上设置的失效时间（单位：小时）,得出真正的失效时间
    const refreshTtl = jwtData.payload.iat + this.refreshTtl;

    // 判断是否已失效
    if (refreshTtl < Math.floor(new Date().getTime() / 1000)) {
      this.jwtException(403, 'token 已失效');
    }

    // 签发新 token
    return this.create(jwtData.payload.customClaims);
  }
}

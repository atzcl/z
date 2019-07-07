/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| access_token 处理
|
*/

import * as qs from 'qs';
import { BaseRequest } from './Request';
import { md5 } from './Utils';

export class AccessToken extends BaseRequest {
  /**
   * @val {string} 获取 access_toen 的 url
   */
  endpointToGetToken: string = '';

  /**
   * access_token 缓存标识
   */
  get getCacheKey() {
    return `${this.cachePrefix}.${md5(JSON.stringify(this.getCredentials))}`;
  }

  get getCredentials() {
    return {
      grant_type: 'client_credential',
      appid: this.config.mini_program.app_id,
      secret: this.config.mini_program.secret,
    };
  }

  /**
   * @var {string} 储存到缓存的前缀
   */
  private cachePrefix: string = 'z.wechat.access_token';

  /**
   * 因为微信的 access_token 有效期为 7200/S，为了确保每次使用的 access_token 都是有效的
   * 这里设置一个安全秒数的参数，用于保存到缓存时，过期时间的设置 = 7200 - safeSeconds
   */
  private safeSeconds: number = 500;

  /**
   * 获取 access_token
   *
   * @param {boolean} refresh 是否需要刷新 access_token
   */
  async getToken(refresh: boolean = false): Promise<object> {
    // 如果不是指定需要刷新 token,并且存在缓存
    if (! refresh && await this.cache.has(this.getCacheKey)) {
      // 那么就返回缓存的 token
      return this.cache.get(this.getCacheKey);
    }

    // 请求新的 token
    const token = await this.requestToken();

    // 设置 token 缓存
    this.setToken(token.access_token);

    // 返回新的 token 值
    return token.access_token;
  }

  /**
   * 设置 access_toen 缓存
   *
   * @param {string} token 需要储存的 access_toen 值
   * @param {number} lifetime 过期时间
   */
  async setToken(token: string, lifetime: number = 7200) {
    this.cache.set(
      this.getCacheKey, // 标识
      token, // 值
      lifetime - this.safeSeconds, // 过期时间
    );
  }

  /**
   * 刷新 access_token
   *
   * @returns {object}
   */
  async refresh() {
    return this.getToken(true);
  }

  /**
   * 发送请求
   */
  async requestToken() {
    // 请求获取 access_token
    const result = await this.baseRequest(`${this.endpointToGetToken}?${qs.stringify(this.getCredentials)}`);

    // 判断是否返回错误
    await this.resolveBodyHasError(result);

    return result;
  }
}

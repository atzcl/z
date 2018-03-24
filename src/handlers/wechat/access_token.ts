/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| access_token 处理
|
*/

import BaseHandler from '../../base_class/base_handler'

export default class AccessToken extends BaseHandler {
  /**
   * @var {string} access_token 的类型
   */
  private tokenType: string = 'client_credential'

  /**
   * @var {string} 储存到缓存的前缀
   */
  private cachePrefix: string = 'wechat.access_token'

  /**
   * 因为微信的 access_token 有效期为 7200/S，为了确保每次使用的 access_token 都是有效的
   * 这里设置一个安全秒数的参数，用于保存到缓存时，过期时间的设置 = 7200 - safeSeconds
   */
  private safeSeconds: number = 500

  /**
   * @val {string} 获取 access_toen 的 url
   */
  private endpointToGetToken: string = `${this.app.config.wechat.base_uri}token`

  /**
   * 设置获取 access_token 的类型
   */
  set grantType (key: string) {
    this.tokenType = key
  }

  /**
   * 设置 获取 access_toen 的 url
   *
   * @param {string} key 获取 access_toen 的 url 的 key
   */
  set setEndpointToGetToken (key: string) {
    this.endpointToGetToken = this.app.config.wechat.base_uri + key
  }

  /**
   * access_token 缓存标识
   */
  get getCacheKey () {
    return `${this.cachePrefix}.${this.tokenType}`
  }

  /**
   * 获取 access_token
   *
   * @param {boolean} refresh 是否需要刷新 access_token
   */
  public async getToken (refresh: boolean = false): Promise<object> {
    const { ctx } = this

    // 如果不是指定需要刷新 token,并且存在缓存
    if (!refresh && await ctx.handlers.cache.has(this.getCacheKey)) {
      // 那么就返回缓存的 token
      return ctx.handlers.cache.get(this.getCacheKey)
    }

    // 请求新的 token
    let token = await this.requestToken()

    // 设置 token 缓存
    this.setToken(token)

    // 返回新的 token 值
    return token
  }

  /**
   * 设置 access_toen 缓存
   *
   * @param token 需要储存的 access_toen 值
   * @param lifetime 过期时间
   */
  public async setToken (token: any, lifetime: number = 7200) {
    this.ctx.handlers.cache.set(
      this.getCacheKey, // 标识
      token, // 值
      lifetime - this.safeSeconds // 过期时间
    )
  }

  /**
   * 刷新 access_token
   *
   * @returns {object}
   */
  public async refresh () {
    return this.getToken(true)
  }

  public async requestToken () {
    // 请求获取 access_token
    let result = await this.ctx.curl(`${this.endpointToGetToken}?grant_type=${this.tokenType}&appid=${this.app.config.wechat.app_id}&secret=${this.app.config.wechat.secret}`, {
      dataType: 'json'
    })

    // 判断是否返回错误
    if (result.data.errcode) {
      await this.ctx.abort(422, `${result.data.errcode} ---> ${result.data.errmsg}`)
    }

    return result.data
  }
}

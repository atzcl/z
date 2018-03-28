/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 微信的请求处理
|
*/

import BaseHandler from '../base_handler'

export default class WeChatRequest extends BaseHandler {
  /**
   * get 请求
   *
   * @param {string} url 请求 url
   * @param {object} options curl 请求配置
   */
  public async get (url: string, options?: object) {
    let result = await this.ctx.curl(
      await this.requestUrl(url),
      {
        dataType: 'json',
        ...options
      }
    )

    // 判断是否返回错误
    await this.isError(result.data)

    return result.data
  }

  /**
   * post 请求
   *
   * @param url 请求 url
   * @param options curl 请求配置
   */
  public async post (url: string, options?: object) {
    let result = await this.ctx.curl(
      await this.requestUrl(url),
      {
        method: 'POST',
        contentType: 'json',
        dataType: 'json',
        ...options
      }
    )

    // 判断是否返回错误
    await this.isError(result.data)

    return result.data
  }

  /**
   * 获取基础 url
   */
  private async requestUrl (url: string) {
    // 获取 access_token
    let token: any = await this.ctx.handlers.wechat.accessToken.getToken()
    // 返回完整的请求 url
    return `${this.app.config.wechat.base_uri}${url}?access_token=${token.access_token}`
  }

  /**
   * 判断是否携带错误属性
   *
   * @param res  curl 的 data 结果
   */
  private async isError (res: any) {
    if (!res.errcode) return

    await this.ctx.abort(422, `【 微信调用异常 】${res.errcode} ---> ${res.errmsg}`)
  }
}

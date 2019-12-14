import * as request from 'request'
import * as qs from 'qs'

import { sha256, getTimestamp } from './Util'


export class Dingtalk {
  /**
   * @val {string} 获取 access_toen 的 url
   */
  protected endpointToGetToken = 'https://oapi.dingtalk.com/robot/send'

  protected access_token: string

  protected secret: string

  protected body = {} as any

  protected atMobiles!: string[]

  constructor(access_token: string, secret: string) {
    this.secret = secret
    this.access_token = access_token
  }

  setAccessToken(value: string) {
    this.access_token = value

    return this
  }

  setSecret(value: string) {
    this.secret = value

    return this
  }

  setAtMobiles(value: string[]) {
    this.atMobiles = value

    return this
  }

  markdown(markdown: { title: string, text: string, }) {
    this.body = { msgtype: 'markdown', markdown }

    return this
  }

  text(content: string) {
    this.body = { msgtype: 'text', text: { content } }

    return this
  }

  link(link: { text: string, title: string, picUrl?: string, messageUrl: string, }) {
    this.body = { msgtype: 'link', link }

    return this
  }

  async send(data?: {[k: string]: any, }, atMobiles?: string[]) {
    const timestamp = getTimestamp()
    const secretEncode = `${timestamp}\n${this.secret}`
    const sign = sha256(this.secret, secretEncode, 'base64')
    const { access_token } = this

    let at: any = {
      isAtAll: true,
    }

    if (atMobiles || this.atMobiles) {
      at = {
        atMobiles,
        isAtAll: false,
      }
    }

    return request.post(
      `${this.endpointToGetToken}?${qs.stringify({ access_token, timestamp, sign })}`,
      {
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ ...{ ...this.body, ...data || {} }, ...at }),
      },
      (_error: Error, response: request.Response) => {
        if (! _error) {
          const body = JSON.parse(response.body)
          if (body.errcode) {
            console.error(body)
          }
        }
      },
    )
  }
}

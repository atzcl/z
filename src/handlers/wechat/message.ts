/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 发送微信消息
|
*/

import BaseHandler from '../../base_class/base_handler'

export default class Message extends BaseHandler {
  /**
   * 组装响应微信服务器的 text 消息的 xml
   *
   * @param {string} content 回复的内容
   */
  public async text (content: string) {
    const { ctx } = this
    ctx.body = `<xml><ToUserName><![CDATA[${ctx.request.body.FromUserName}]]></ToUserName> <FromUserName><![CDATA[${ctx.request.body.ToUserName}]]></FromUserName> <CreateTime>${Math.floor(new Date().getTime() / 1000)}</CreateTime> <MsgType><![CDATA[text]]></MsgType> <Content><![CDATA[${content}]]></Content></xml>`
  }
}

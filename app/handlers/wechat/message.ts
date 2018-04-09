/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 发送微信消息
|
*/

import BaseHandler from '../base_handler';

export default class Message extends BaseHandler {
  /**
   * 组装响应微信服务器的 text 消息的 xml
   *
   * @param {string} content 回复的内容
   */
  public async text (content: string) {
    const requestBody = this.ctx.request.body;
    const time = Math.floor(new Date().getTime() / 1000);

    this.ctx.body = `<xml>` +
    `<ToUserName><![CDATA[${requestBody.FromUserName}]]></ToUserName>` +
    `<FromUserName><![CDATA[${requestBody.ToUserName}]]></FromUserName>` +
    `<CreateTime>${time}</CreateTime>` +
    `<MsgType><![CDATA[text]]></MsgType>` +
    `<Content><![CDATA[${content}]]></Content>` +
    `</xml>`;
  }
}

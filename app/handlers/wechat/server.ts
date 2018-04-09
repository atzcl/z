/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 微信入口处理
|
*/

import { createHash } from 'crypto';
import BaseHandler from '../base_handler';

export default class Server extends BaseHandler {

  /**
   * 验证消息的确来自微信服务器
   *
   * @returns {void}
   */
  public async server (): Promise<void> {
    const { ctx } = this;

    // 判断访问的是否是微信服务器
    if (await this.signature() !== ctx.request.query.signature) {
      ctx.abort(403, '该访问不被允许');
    }

    // 将微信传递的 echostr 随机字符原样返回
    ctx.body = ctx.request.query.echostr;
  }

  /**
   * 处理微信传递参数的加密
   *
   * @returns {string}
   */
  public async signature (): Promise<string> {
    const { ctx, app } = this;
    const query: any = ctx.request.query;

    // 将微信传递的 timestamp、nonce 跟自己在接口配置信息填写的 token 进行组成数组并排序
    const signature: any = [ app.config.wechat.token, query.timestamp, query.nonce ].sort();

    // 将上述排序完成的数组转化为字符串，并进行 sha1 加密
    return createHash('sha1').update(signature.join('')).digest('hex');
  }
}

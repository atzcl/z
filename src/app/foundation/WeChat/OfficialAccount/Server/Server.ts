/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 微信服务端处理
|
*/

import * as getRawBody from 'raw-body'; // 获取 Buffer 缓冲区数据
import { Context } from 'midway';

import BaseClient from '../../Kernel/BaseClient';
import { XML } from '../../Kernel/Support/XML';
import { sha1 } from '../../Kernel/Utils';
import { Message, MessageEnum } from '../../Kernel/Messages/Message';
import { Text } from '../../Kernel/Messages/Text';

import { MessageHandle, MessageHandleParams } from './Interceptors';

/**
 * todo: 待增加密文模式
 *
 * @ref https://github.com/overtrue/wechat/blob/c78fbd3e6f/src/Kernel/ServerGuard.php
 */
export class Server extends BaseClient {
  request: Context['request'] | undefined;

  response: Context['response'] | undefined;

  // 消息处理器集合
  handlers: Map<MessageEnum, MessageHandle[]> = new Map();

  /**
   * 新增消息处理器
   *
   * @param {function} 闭包的消息处理器
   */
  push<T>(handle: MessageHandle<T>, condition: MessageEnum = MessageEnum.All) {
    if (! this.handlers.has(condition)) {
      this.handlers.set(condition, []);
    }

    if (typeof handle === 'function') {
      // 设置到对应消息类型集合中
      const handlers = this.handlers.get(condition) as MessageHandle[];
      handlers.push(handle as MessageHandle);
    }

    return this;
  }

  /**
   * 验证消息的确来自微信服务器
   *
   * @returns {void}
   */
  async serve(request: Context['request'], response: Context['response']) {
    this.request = request;
    this.response = response;

    if (request.method === 'GET' || ! this.handlers.size) {
      // 判断访问的是否是微信服务器
      if (await this.signature(request.query) === request.query.signature) {
        // 将微信传递的 echostr 随机字符原样返回
        response.body = request.query.echostr;

        return;
      }

      this.abort(403, '非法访问');
    }

    if (request.header['content-type'] !== 'text/xml') {
      this.abort(403, '非法访问');
    }

    return this.resolve();
  }

  /**
   * 解析执行 handlers
   * @description 最后一个非空返回值将作为最终应答给用户的消息内容
   *              如果中间某一个 handler 返回值 false, 则将终止整个调用链，不会调用后续的 handlers
   *
   * @returns {any}
   */
  protected async resolve() {
    // 将 xml 数据转换为 object
    const messageData = await this.parseMessage() as MessageHandleParams;

    // 最后需要返回的结果
    let handlersResult: any = 'SUCCESS';

    try {
      for (const [type, handles] of this.handlers) {
        if (
          ! [MessageEnum.All, messageData.MsgType.toLowerCase()].includes(type)
          || ! handles.length
        ) {
          continue;
        }

        for (const handle of handles) {
          const handleResult = await handle(messageData);

          // 只会拿最后一个非空返回值将作为最终应答给用户的消息内容
          if (handleResult) {
            handlersResult = handleResult;
          }

          if (handleResult === false) {
            throw new Error('如果返回的是 false, 那么就中断整个调用链');
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    // 清空重置消息处理器
    this.handlers.clear();

    return this.buildResponse(handlersResult, messageData);
  }

  /**
   * 生成响应
   *
   * @param {*} handlersResult 消息处理器处理后的结果
   * @param {THandleParams} messageData 对应消息类的实例
   */
  protected async buildResponse(handlersResult: any, messageData: MessageHandleParams) {
    // 如果是字符、整数，那么就返回默认返回文本消息
    if (['string', 'number'].includes(typeof handlersResult)) {
      handlersResult = new Text(handlersResult);
    }

    return this.buildReply(
      messageData.FromUserName,
      messageData.ToUserName,
      handlersResult,
    );
  }

  /**
   * 返回请求
   *
   * @param {string} 接收方 open_id
   * @param {string} 发送方 open_id
   * @param {Message} 对应消息类的实例
   *
   * @returns {void}
   */
  protected async buildReply(to: string, from: string, message: Message) {
    const prepends = {
      ToUserName: to,
      FromUserName: from,
      CreateTime: new Date().getTime(),
      MsgType: message.getType(),
    };

    if (! this.response) {
      return
    }

    this.response.type = 'application/xml';
    this.response.body = message.transformToXml(prepends);
  }

  /**
   * 处理微信传递参数的加密
   *
   * @returns {string}
   */
  protected async signature(query: any) {
    // 将微信传递的 timestamp、nonce 跟自己在接口配置信息填写的 token 进行组成数组并排序
    const signature: any[] = [
      this.config.official_account.token,
      query.timestamp,
      query.nonce,
    ].sort();

    // 将上述排序完成的数组转化为字符串，并进行 sha1 加密
    return sha1(signature.join(''));
  }

  /**
   * 解析 xml
   *
   * @returns {object}
   */
  protected async parseMessage() {
    if (! this.request) {
      return
    }

    const body = this.request.body;
    // 取原始数据
    const xml = body && typeof body === 'string'
      ? body
      : await getRawBody(this.request.req, {
        length: this.request.length,
        limit: '1mb',
        encoding: this.request.charset || 'utf-8',
      });

    return XML.check(xml as string) ? XML.parse(xml) : {};
  }
}

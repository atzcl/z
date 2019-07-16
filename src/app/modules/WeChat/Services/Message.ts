/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 处理微信消息
|
*/

import { provide } from 'midway';

import { Service } from '@/app/foundation/Bases/BaseService';
import { Text } from '@/app/foundation/WeChat/Kernel/Messages/Text';
import { WeChatMessageEvent, WeChatMessageSubject } from '@/app/foundation/WeChat/OfficialAccount/Server/Interceptors';

// 在容器的 id 名称
export const SERVICE_PROVIDE = 'weChatMessageService';

@provide(SERVICE_PROVIDE)
export class WeChatMessageService extends Service {
  /**
   * 在一个方式里面处理分发所有的消息事件
   *
   * @param {WeChatMessageSubject} message 微信服务器传递过来的消息
   *
   * @returns {any}
   */
  async handleAllMessage(message: WeChatMessageSubject) {
    switch (message.MsgType.toLowerCase()) {
      case 'event': {
        const { Event, EventKey } = message as WeChatMessageEvent;

        return this.handleEvent(Event, EventKey);
      }
      case 'text':
        return this.sendTextMessage('收到文字消息');
      case 'image':
        return this.sendTextMessage('收到图片消息');
      case 'voice':
        return this.sendTextMessage('收到语音消息');
      case 'video':
        return this.sendTextMessage('收到视频消息');
      case 'location':
        return this.sendTextMessage('收到坐标消息');
      case 'link':
        return this.sendTextMessage('收到链接消息');
      // ... 其它消息
      default:
        return this.sendTextMessage('收到其它消息');
    }
  }

  /**
   * 解析微信返回的各种 Event 类型，并进行相应处理
   *
   * @returns {void}
   */
  async handleEvent(event: string, eventKey?: string) {
    // 判断事件类型 // 转化为小写
    switch (event.toLowerCase()) {
      case 'subscribe':
        if (eventKey && eventKey.toLowerCase()) {
          return this.sendTextMessage('扫描带参数二维码的订阅');
        }

        // 处理订阅
        return this.sendTextMessage('感谢您的订阅');
      case 'unsubscribe':
        return this.sendTextMessage('你居然取消订阅，太可怕了');
      case 'scan':
        return this.sendTextMessage('scan');
      case 'latitude':
        return this.sendTextMessage('上报地理位置事件');
      case 'click':
        return this.sendTextMessage('点击菜单拉取消息时的事件推送');
    }
  }

  /**
   * 简单地快速回复消息
   *
   * @param {string} content 消息内容
   */
  async sendTextMessage(content: string) {
    return new Text(content);
  }
}

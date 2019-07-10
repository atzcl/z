/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 微信模块
|
*/

import { controller, provide, inject, all, get } from 'midway';
import { Controller } from '@/app/foundation/Bases/BaseController';
import { WeChat } from '@/wechat';
import { Image } from '@/app/foundation/WeChat/Kernel/Messages/Image';
import { Text } from '@/app/foundation/WeChat/Kernel/Messages/Text';
import { MessageEnum } from '@/app/foundation/WeChat/Kernel/Messages/Message';
import { WeChatMessageText } from '@/app/foundation/WeChat/OfficialAccount/Server/interceptors';
import { WeChatMessageService } from '../Services/Message';

@provide()
@controller('/wechat')
export class WeChatController extends Controller {
  @inject()
  wechat: WeChat;

  @inject()
  weChatMessageService: WeChatMessageService;

  /**
   * 微信入口
   */
  @all('/')
  async index() {
    const { server } = this.wechat.officialAccount;

    // 图片消息处理器, 即只有当用户发送图片消息时，才会触发当前处理器
    await server.push<WeChatMessageText>(
      (message) => new Text(`您发送了 text 消息: ${message.Content}`),
      MessageEnum.TEXT,
    );

    // 图片消息处理器, 即只有当用户发送图片消息时，才会触发当前处理器
    await server.push(
      () => new Image('mzU3sC5Us6lulaLHvRN3gBEDbMgBMJ6Aly3e_r-FFX0-MgKs0bcoDhe0bXF_GQZF'),
      MessageEnum.IMAGE,
    );

    // 在一个事件里面处理分发
    await server.push(this.weChatMessageService.handleAllMessage.bind(this.weChatMessageService));

    // 响应给微信服务器
    await server.serve(this.request, this.response);
  }

  // 上传素材
  @get('/uploads')
  async upload() {
    await this.wechat.officialAccount.material.uploadImage(this.app.publicPath('images/logo.png'));
  }
}

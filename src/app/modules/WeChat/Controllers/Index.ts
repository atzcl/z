/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 微信模块
|
*/

import { controller, provide, inject, all, get } from 'midway';
import { Controller } from '@app/foundations/Bases/BaseController';

import { WeChatMessageService } from '../Services/Message';

import { WeChat } from '@/app/foundations/WeChat';
import { Image } from '@/app/foundations/WeChat/Kernel/Messages/Image';
import { Text } from '@/app/foundations/WeChat/Kernel/Messages/Text';
import { MessageEnum } from '@/app/foundations/WeChat/Kernel/Messages/Message';
import { WeChatMessageText } from '@/app/foundations/WeChat/OfficialAccount/Server/Interceptors';
import { SkipPermissionCheck } from '@/app/foundations/Support/SkipPermissionCheck';


SkipPermissionCheck.addWildRoute('/wechat');

@provide()
@controller('/wechat')
export class WeChatController extends Controller {
  constructor(
    @inject() private readonly wechat: WeChat,
    @inject() private readonly weChatMessageService: WeChatMessageService,
  ) {
    super();
  }

  /**
   * 微信入口
   */
  @all('/')
  async index() {
    const { server } = this.wechat.officialAccount;

    // 图片消息处理器, 即只有当用户发送图片消息时，才会触发当前处理器
    server.push<WeChatMessageText>(
      message => new Text(`您发送了 text 消息: ${message.Content}`),
      MessageEnum.TEXT,
    );

    // 图片消息处理器, 即只有当用户发送图片消息时，才会触发当前处理器
    server.push(
      () => new Image('mzU3sC5Us6lulaLHvRN3gBEDbMgBMJ6Aly3e_r-FFX0-MgKs0bcoDhe0bXF_GQZF'),
      MessageEnum.IMAGE,
    );

    // 在一个事件里面处理分发
    server.push(this.weChatMessageService.handleAllMessage.bind(this.weChatMessageService));

    // 响应给微信服务器
    return server.serve(this.request, this.response);
  }

  // 上传素材
  @get('/uploads')
  async upload() {
    await this.wechat.officialAccount.material.uploadImage(this.app.publicPath('images/logo.png'));
  }
}

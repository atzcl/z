import Controller from '../base_controller'

export default class IndexController extends Controller {
  /**
   * 微信入口
   */
  public async index (): Promise<void> {
    const { ctx } = this

    // 微信验证处理
    if (ctx.request.method === 'GET') {
      return ctx.handlers.wechat.server.server()
    }

    // 微信消息处理
    await this.parseMessage()
  }

  /**
   * 解析微信返回的各种消息类型，并进行相应处理
   *
   * @returns {void}
   */
  public async parseMessage () {
    switch (this.ctx.request.body.MsgType) {
      case 'event':
        return this.sendTextMessage('收到事件消息')
      case 'text':
        return this.sendTextMessage('收到文字消息')
      case 'image':
        return this.sendTextMessage('收到图片消息')
      case 'voice':
        return this.sendTextMessage('收到语音消息')
      case 'video':
        return this.sendTextMessage('收到视频消息')
      case 'location':
        return this.sendTextMessage('收到坐标消息')
      case 'link':
        return this.sendTextMessage('收到链接消息')
      // ... 其它消息
      default:
        await this.sendTextMessage('收到其它消息')
        break
    }

    this.ctx.throw(403, '')
  }

  /**
   * 简单地快速回复消息
   *
   * @param {string} content 消息内容
   */
  public async sendTextMessage (content: string) {
    await this.ctx.handlers.wechat.message.text(content)
  }
}

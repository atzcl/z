import Controller from '../../controller'

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

    // await ctx.wechatService.wechat.test()
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
        return this.parseEvent()
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

    this.ctx.abort(403, '')
  }

  /**
   * 解析微信返回的各种 Event 类型，并进行相应处理
   *
   * @returns {void}
   */
  public async parseEvent () {
    const { ctx } = this

    // 判断事件类型 // 转化为小写
    switch (ctx.request.body.Event.toLowerCase()) {
      case 'subscribe':
        if (ctx.request.body.EventKey) {
          return this.sendTextMessage(
            `感谢您通过扫描带参数二维码的订阅, ${await ctx.wechatService.wechatUser.login()}`
          )
        }
        return this.sendTextMessage('感谢您的订阅')
      case 'unsubscribe':
        return this.sendTextMessage('你居然取消订阅，太可怕了')
      case 'scan':
        return this.sendTextMessage(await ctx.wechatService.wechatUser.login())
      case 'latitude':
        return this.sendTextMessage('上报地理位置事件')
      case 'click':
        return this.sendTextMessage('点击菜单拉取消息时的事件推送')
    }
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

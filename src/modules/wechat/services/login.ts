import { Service } from 'egg'

export default class LoginService extends Service {
  /**
   * 处理注册邮件发送
   */
  public async login (body: any): Promise<boolean> {
    const { ctx, app } = this

    // 通过扫码且初次关注，返回的 EventKey 属性是带有 qrscene_ 前缀的，所以这里需要注意下
    let realEventKey = body.EventKey.split('qrscene_')
    if (realEventKey.length > 1) {
      // 如果符合初次关注，那么就把值给替换为真正的 scene_id 值
      body.EventKey = realEventKey
    }

    // 响应返回
    app.io.to(body.EventKey).emit('loginQrCodeSuccess',
    ctx.helper.toSocketResponse(200, `登录成功，open_id: ${body.ToUserName}`))

    return true
  }
}

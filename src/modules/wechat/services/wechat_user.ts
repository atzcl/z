import Service from '../../service'

export default class WechatUserService extends Service {
  /**
   * 微信用户扫码登录
   */
  public async login (): Promise<string> {
    const { ctx } = this

    // 返回提示
    let loginMsg = '登录失败或者二维码已失效, 请刷新重试'

    // 到微信服务器查询该用户的详情
    let userInfo = await this.getWeChatUserInfo(this.getRequestBody.FromUserName)

    // 获取当前微信用户的在库请求
    let result = await ctx.wechatRepository.wechatUser.scanQrCodeLogin(
      Object.assign(userInfo, { app_id: this.getRequestBody.ToUserName }) // 添加 app_id
    )

    // 处理通知客户端事务
    if (result) {
      loginMsg = await this.notifyLoginStatus(result)
    }

    return loginMsg
  }

  /**
   * 获取微信用户的详细信息
   *
   * @param {string} openID 查询的用户 open_id
   * @returns {object}
   */
  public async getWeChatUserInfo (openID: string) {
    return this.ctx.handlers.wechat.user.get(openID)
  }

  /**
   * 判断该次扫码是初次关注还是已经关注
   *
   * @param {string} evn 扫码事件的 EventKey
   * @returns {object}
   */
  public async getEventKey (evn: string) {
    let result = {
      event_key: evn, // scene_id 值
      first_attention: false // 是否初次关注,可能后面有其他业务需要，所以这里加多这样的一个值
    }

    // 通过扫码且初次关注，返回的 EventKey 属性是带有 qrscene_ 前缀的，所以这里需要注意下
    let realEventKey = evn.split('qrscene_')
    if (realEventKey.length > 1) {
      // 如果符合初次关注，那么就把值给替换为真正的 scene_id 值
      result.event_key = realEventKey[1]
      result.first_attention = true
    }

    return result
  }

  /**
   * 通知客户端扫码登录的情况
   *
   * @returns {string}
   */
  public async notifyLoginStatus (result: any) {
    const { ctx } = this

    // 获取 scene_id
    let { event_key } = await this.getEventKey(this.getRequestBody.EventKey)

    if (await this.handlers.socketIo.isOnline(event_key)) {
      // 定义返回数据
      let sendData = {
        id: result.id,
        avatar: result.avatar,
        nickname: result.nickname,
        token: await this.handlers.jwt.create(result) // 创建 token
      }

      // 响应返回
      this.handlers.socketIo.sendToClient(
        event_key,
        'loginQrCodeSuccess',
        ctx.helper.toSocketResponse(200, sendData, '登录成功')
      )

      return '登录成功'
    }

    return '登录失败,扫码的客户端不在线，请刷新重试'
  }
}

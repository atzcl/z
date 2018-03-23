import Controller from '../base_controller'

export default class LoginController extends Controller {
  /**
   * 微信登录二维码
   *
   * @returns {string}
   */
  public async qrCode (): Promise<void> {
    const { ctx } = this
    let result = await ctx.handlers.wechat.qrCode.temporary('atzcl')
    this.succeed(await ctx.handlers.wechat.qrCode.url(result.ticket))
  }
}

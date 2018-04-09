import Controller from '../../controller';

export default class LoginController extends Controller {
  /**
   * 微信登录二维码
   *
   * @returns {string}
   */
  public async qrCode (): Promise<void> {
    const { ctx, app } = this;

    // 生成微信带参数二维码，时长为 120 秒
    // 携带的参数为通过 socket.io 链接成功的 socket id
    const result = await ctx.handlers.wechat.qrCode.temporary(ctx.socket.id);
    // 获取二维码展示的 url
    const qrCodeUrl = await ctx.handlers.wechat.qrCode.url(result.ticket);

    // 响应返回
    app.io.to(ctx.socket.id).emit('getLoginQrCodeUrl', ctx.helper.toSocketResponse(200, qrCodeUrl));
  }
}

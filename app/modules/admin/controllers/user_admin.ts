import Controller from '../../controller';

export default class UserAdminController extends Controller {
  /**
   * 当前需要使用的 service
   */
  private get currentService () {
    return this.ctx.userService;
  }

  /**
   * 登录
   *
   * @throws {Error}
   * @returns {object}
   */
  public async login () {
    const { ctx, config } = this;

    // 验证
    await ctx.validate(ctx.userValidateRule.auth.login());

    // 处理登录
    const result: any = await this.currentService.auth.handleLogin();

    // 更换 jwt 密码，后台的用户跟前台用户应该是隔离的
    config.jwt.secret = config.apps.admin_jwt_secret;

    // 成功返回
    this.succeed({
      name: result.name,
      status: result.status,
      token: await this.foundation.jwt.create(result), // 创建 token
    });
  }
}

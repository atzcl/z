import Controller from '../../controller';

export default class UserController extends Controller {
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
    const { ctx } = this;

    // 验证
    await ctx.validate(ctx.userValidateRule.auth.login());

    const result: any = await this.currentService.auth.handleLogin();

    // 成功返回
    this.succeed({
      name: result.name,
      status: result.status,
      token: await this.foundation.jwt.create(result),
    });
  }

  /**
   * 注册
   *
   * @throws {Error}
   * @returns {object}
   */
  public async register () {
    const { ctx } = this;

    // 验证
    await ctx.validate(ctx.userValidateRule.auth.register());

    const result: any = await this.currentService.auth.handleRegister();

    this.succeed(result.id);
  }

  /**
   * 发送重置密码的邮件
   *
   * @throws {Error}
   * @returns {object}
   */
  public async sendPasswordResetEmail () {
    const { ctx } = this;

    // 验证
    await ctx.validate(ctx.userValidateRule.auth.sendPasswordRestMail());

    // 发送邮件
    await this.currentService.auth.handleSendPasswordResetEmail(
      this.getRequestBody.email,
    );

    // 成功返回
    return this.setStatusMessage('重置密码邮件发送成功').succeed();
  }

  /**
   * 通过邮件链接重置密码，验证是否有效
   *
   * @throws {Error}
   * @returns {object}
   */
  public async resetPassword () {
    const { ctx } = this;

    // 验证
    await ctx.validate(ctx.userValidateRule.auth.sendPasswordRestMail(), this.request.query);

    // 验证 token 是否有效
    await this.currentService.auth.verifyRestPasswordToken(this.request.query.email, this.request.query.token);

    // 返回前端结果
    this.succeed(this.request.query);
  }

  /**
   * 重置密码
   *
   * @throws {Error}
   * @returns {object}
   */
  public async updatePassword () {
    const { ctx } = this;

    // 验证
    await ctx.validate(ctx.userValidateRule.auth.updatePassword());

    // 验证 token 是否有效
    await this.currentService.auth.verifyRestPasswordToken(this.getRequestBody.email, this.getRequestBody.token);

    // 更新密码
    const result = await this.currentService.auth.handleUpdatePassword(
      this.getRequestBody.name, this.getRequestBody.password,
    );

    if (result) {
      // 返回响应
      return this.succeed();
    }

    ctx.abort(500, '密码重置失败');
  }
}

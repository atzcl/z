import Controller from '../base_controller'
import { validateBody } from '../../../lib/decorator/validate';

export default class LoginController extends Controller {
  /**
   * 用户登录
   *
   * @returns void
   */
  @validateBody('admin.auth.login')
  public async login(): Promise<void> {
    // 查询用户详情
    const result: any = await this.ctx.repository.admin.auth.login.getInfo()

    if (result) {
      // 判断密码是否一致
      if (await this.app.verifyBcrypt(this.ctx.request.body.password, result.dataValues.password)) {
        this.succeed('登录成功')
        return
      }
    }

    this.ctx.throw(422, '账号或密码不正确')
  }
}

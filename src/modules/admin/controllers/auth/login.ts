import Controller from '../../../controller'
import { validateBody } from '../../../../lib/decorator/validate'

export default class LoginController extends Controller {
  /**
   * 用户登录
   *
   * @returns void
   */
  @validateBody('admin.auth.login')
  public async login (): Promise<void> {
    const { ctx } = this

    // 查询用户详情
    const result: any = await ctx.repository.admin.auth.login.getInfo()

    if (result) {
      // 判断密码是否一致
      if (await this.app.verifyBcrypt(ctx.request.body.password, result.password)) {
        // 删除密码属性
        delete result.password

        // 成功返回
        this.succeed({
          name: result.name,
          status: result.status,
          token: await ctx.handlers.jwt.create(result)
        })

        return
      }
    }

    ctx.abort(422, '账号或密码不正确')
  }
}

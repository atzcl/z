import Controller from '../../base_controller'
import { validateBody } from '../../../lib/decorator/validate'

export default class RegisterController extends Controller {
  /**
   * 用户注册
   *
   * @returns void
   */
  @validateBody('admin.auth.register')
  public async register () {
    // 创建用户
    const result: any = await this.ctx.repository.admin.auth.register.createUser()

    if (result) {
      await this.succeed(result.id)
      return
    }

    this.ctx.abort(500, '注册失败~')
  }
}

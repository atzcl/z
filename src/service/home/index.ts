import BaseService from '../service'

export default class IndexService extends BaseService {
  async index() {
    const { ctx } = this
    ctx.validate(ctx.validateRule.admin.auth.login())

    this.succeed('验证成功')
  }
}

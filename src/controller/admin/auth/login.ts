import Controller from '../base'

export default class LoginController extends Controller {
  async index(): Promise<void> {
    this.ctx.service.home.index.index(await this.ctx.repository.admin.auth.login.getInfo())
  }
}
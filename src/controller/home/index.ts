import Controller from './base_controller'

export default class IndexController extends Controller {
  async index(): Promise<void> {
    this.ctx.validateRule.admin.auth.login()
    console.log('我是调用方')
    this.ctx.service.home.index.index()
  }
}
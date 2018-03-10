import Controller from './base'

export default class IndexController extends Controller {
  async index(): Promise<void> {
    this.ctx.service.home.index.index()
  }
}
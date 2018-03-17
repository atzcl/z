import Controller from './base_controller'

export default class IndexController extends Controller {
  async index (): Promise<void> {
    console.log(await this.ctx.handlers.cache.set('test', 123456, 120))
  }
}

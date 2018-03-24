import Controller from '../base_controller'

export default class IndexController extends Controller {
  async index (): Promise<void> {
    console.log(this.ctx.request.href)
    // this.succeed(await this.ctx.handlers.jwt.create({ id: 123 }))
  }
}

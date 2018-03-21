import Controller from '../base_controller'
import { createHash } from 'crypto'

export default class IndexController extends Controller {
  async index (): Promise<void> {
    await this.ctx.handlers.wechat.server.server()
  }
}

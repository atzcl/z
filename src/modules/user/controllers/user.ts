import BaseController from '../../controller'

export default class UserRepository extends BaseController {
  public async test () {
    this.ctx.body = 111
  }
}

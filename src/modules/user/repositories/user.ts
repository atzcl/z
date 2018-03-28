import BaseRepository from '../../repository'

export default class UserController extends BaseRepository {
  get model () {
    return this.ctx.model.UserAdmin
  }

  public async test () {
    console.log(111)
  }
}

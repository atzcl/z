import BaseRepository from '../../../repository'

export default class RegisterRepository extends BaseRepository {
  /**
   * 定义 model
   */
  get model () {
    return this.ctx.model.UserAdmin
  }

  /**
   * 创建用户
   */
  public async createUser () {
    return this.created()
  }
}

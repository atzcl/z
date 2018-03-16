import BaseRepository from '../../../base_class/base_repository'

export default class RegisterRepository extends BaseRepository {
  /**
   * 定义 model
   */
  get model() {
    return this.ctx.model.UserAdmin
  }

  /**
   * 创建用户
   */
  public async createUser() {
    return await this.created()
  }
}
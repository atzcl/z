import BaseRepository from '../../../base_class/base_repository'

export default class LoginRepository extends BaseRepository {
  get model() {
    return this.ctx.model.UserAdmin
  }
  
  /**
   * 查询用户信息
   */
  public async getInfo() {
    return await this.findByField('name', this.ctx.request.body.name)
  }
}
import BaseRepository from '../../../repository'

export default class LoginRepository extends BaseRepository {
  get model () {
    return this.ctx.model.UserAdmin
  }

  /**
   * 查询用户信息
   *
   * @returns {object | null}
   */
  public async getInfo (): Promise<null | object> {
    return this.ctx.helper.getDataValues(await this.findByField('name', this.ctx.request.body.name))
  }
}

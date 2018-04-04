import BaseRepository from '../../repository'

export default class UserPasswordResetRepository extends BaseRepository {
  get model () {
    return this.ctx.model.UserPasswordReset
  }

  /**
   * 获取指定 token 信息
   *
   * @param {string} field 指定类型名称
   * @param {string} value 传入的值
   */
  public async getTokenInfo (email: string, token: string) {
    return this.where({ email: email }).where({ token: token }).first()
  }

  /**
   * 创建指定 token 信息
   *
   * @param {string} field 指定类型名称
   * @param {string} value 传入的值
   */
  public async createToken (email: string, token: string) {
    return this.create({ email: email, token: token })
  }
}

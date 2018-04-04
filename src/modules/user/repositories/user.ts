import BaseRepository from '../../repository'

export default class UserRepository extends BaseRepository {
  get model () {
    return this.ctx.model.User
  }

  /**
   * 获取指定用户信息
   *
   * @param {string} field 指定类型名称
   * @param {string} value 传入的值
   */
  public async getUserInfo (field: string, value: string) {
    return this.findByField(field, value)
  }

  /**
   * 创建用户数据
   *
   * @param {object} data 创建数据
   */
  public async createUser (data: object) {
    return this.create(data)
  }

  /**
   * 获取指定邮箱的情况
   *
   * @param {string} value 邮箱值
   */
  public async getUserByEmail (value: string) {
    return this.findByField('email', value)
  }

  /**
   * 更新密码
   *
   * @param {string} nane 用户名
   * @param {string} password 密码
   */
  public async updatePassword (name: string, password: string) {
    return this.where({ name: name }).update({ password: password })
  }
}

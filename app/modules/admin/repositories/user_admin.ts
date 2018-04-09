import BaseRepository from '../../repository';

export default class UserAdminRepository extends BaseRepository {
  get model () {
    return this.ctx.model.UserAdmin;
  }

  /**
   * 获取指定用户信息
   *
   * @param {string} field 指定类型名称
   * @param {string} value 传入的值
   */
  public async getUserInfo (field: string, value: string) {
    return this.findByField(field, value);
  }

  /**
   * 创建用户数据
   *
   * @param {object} data 创建数据
   */
  public async createUser (data: object) {
    return this.create(data);
  }
}

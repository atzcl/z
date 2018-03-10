import BaseService from '../service'

export default class IndexService extends BaseService {
  async index() {
    await this.succeed('Service 层输出')
  }
}

import BaseService from '../service'

export default class IndexService extends BaseService {
  async index(name: string = 'Service 层输出') {
    await this.succeed(name)
  }
}

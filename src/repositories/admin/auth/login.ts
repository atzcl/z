import BaseRepository from '../../../base_class/base_repository'

export default class LoginRepository extends BaseRepository {
  public async getInfo(): Promise<string> {
    return 'LoginRepository'
  }
}
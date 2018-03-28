import { Service } from 'egg'

export default class User extends Service {
  async say () {
    return 'Helle Man!'
  }
}

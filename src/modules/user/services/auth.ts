import BaseAuthService from '../../../service/auth'

export default class AuthService extends BaseAuthService {
  public get repository () {
    return this.ctx.userRepository.user
  }

  public get restPasswordRoute () {
    return this.ctx.helper.pathFor('user.password_reset')
  }

  public get activeAccountRoute () {
    return ''
  }
}

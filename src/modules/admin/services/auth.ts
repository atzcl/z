import BaseAuthService from '../../../service/auth'

export default class AuthService extends BaseAuthService {
  public get repository () {
    return this.ctx.adminRepository
  }

  public get restPasswordRoute () {
    return ''
  }

  public get activeAccountRoute () {
    return ''
  }
}

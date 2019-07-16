import { controller, post, provide, inject } from 'midway';

import { UserAdminLoginService } from '../../Services/Auth/AdminLogin';

import { Controller } from '@/app/foundation/Bases/BaseController';
import { validate } from '@/app/foundation/Decorators/Validate';
import { adminPrefix } from '@/config/config.default';

@provide()
@controller(`/users/${adminPrefix}`)
export class AdminLoginController extends Controller {
  @inject()
  private readonly userAdminLoginService!: UserAdminLoginService;

  @post('/login')
  @validate('userLoginValidate')
  async login() {
    const result = await this.userAdminLoginService.handleLogin();

    this.setStatusData(result).setStatusMessage('登录成功').succeed();
  }
}

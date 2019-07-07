import { controller, post, provide, inject, Context } from 'midway';

import { Controller } from '@/app/foundation/Bases/BaseController';
import { validate } from '@/app/foundation/Decorators/Validate';
import { UserAdminLoginService } from '../../Services/Auth/AdminLogin';
import { adminPrefix } from '@/config/config.default';

@provide()
@controller(`/users/${adminPrefix}`)
export class AdminLoginController extends Controller {
  @inject()
  userAdminLoginService: UserAdminLoginService;

  @post('/login')
  @validate('userLoginValidate')
  async login(ctx: Context) {
    const result = await this.userAdminLoginService.handleLogin();

    this.setStatusData(result).setStatusMessage('登录成功').succeed();
  }
}

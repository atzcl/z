import { controller, post, provide, inject } from 'midway';
import { Controller, getAdminRoute } from '@app/foundation/Bases/BaseController';
import { validate } from '@app/foundation/Decorators/Validate';

import { UserAdminLoginService } from '../../Services/Admin/AdminLogin';


@provide()
@controller(getAdminRoute('users'))
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

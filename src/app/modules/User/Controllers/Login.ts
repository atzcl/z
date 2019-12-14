import { provide, inject, controller, post } from 'midway';

import { UserLoginService } from '@/app/modules/User/Services/Auth/Login';
import { Controller } from '@/app/foundations/Bases/BaseController';
import { validate } from '@/app/foundations/Decorators/Validate';

@provide()
@controller('/users')
export class LoginController extends Controller {
  @inject()
  private readonly userLoginService!: UserLoginService;

  @post('/login')
  @validate('userLoginValidate')
  async login() {
    const result = await this.userLoginService.handleLogin();

    this.setStatusData(result).setStatusMessage('登录成功').succeed();
  }
}

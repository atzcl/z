import { controller, post, provide, inject } from 'midway';
import { Controller, getAdminRoute } from '@app/foundations/Bases/BaseController';
import { validate } from '@app/foundations/Decorators/Validate';

import { UserAdminLoginService } from '../../Services/Admin/AdminLogin';

import { SkipPermissionCheck } from '@/app/foundations/Support/SkipPermissionCheck';


SkipPermissionCheck.add(getAdminRoute('users', 'login'));

@provide()
@controller(getAdminRoute('users'))
export class AdminLoginController extends Controller {
  @inject()
  private readonly userAdminLoginService!: UserAdminLoginService;

  @post('/login')
  @validate('userLoginValidate')
  async login() {
    const result = await this.userAdminLoginService.handleLogin();

    return this.setStatusData(result).succeed('登录成功');
  }
}

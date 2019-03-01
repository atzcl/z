import { controller, post, provide, inject, Context } from 'midway';

import { Controller } from '@/app/foundation/bases/base_controller';
import { validate } from '@/app/foundation/decorators/validate';
import { UserAdminLoginService } from '../../services/auth/admin_login';

@provide()
@controller('/users/admin')
export class AdminLoginController extends Controller {
  @inject()
  userAdminLoginService: UserAdminLoginService;

  @post('/login')
  @validate('userLoginValidate')
  async login(ctx: Context) {
    this.setStatusData(
      await this.userAdminLoginService.handleLogin(),
    ).succeed('登录成功');
  }
}

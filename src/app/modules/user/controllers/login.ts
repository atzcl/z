import { controller, post, provide, inject } from 'midway';

import { UserLoginService } from '@/app/modules/user/services/auth/login';
import { Controller } from '@/app/foundation/bases/base_controller';
import { validate } from '@/app/foundation/decorators/validate';

@provide()
@controller('/users')
export class LoginController extends Controller {
  @inject()
  userLoginService: UserLoginService;

  @post('/login')
  @validate('userLoginValidate')
  async login(): Promise<void> {
    // this.userLoginService.login(ctx);
  }
}

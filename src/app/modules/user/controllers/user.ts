import { controller, provide, inject, get, Context } from 'midway';

import { UserService } from '@/app/modules/User/Services/user';

import * as plural from 'plural';

@provide()
@controller('/users')
export class UserController {
  @inject()
  userService!: UserService;

  @get('/')
  async getUser(ctx: Context): Promise<void> {
    ctx.body = plural('validate');
  }
}

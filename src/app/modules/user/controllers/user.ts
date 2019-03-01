import { controller, get, provide, inject } from 'midway';

import { UserService } from '@my_modules/user/services/user';

import * as plural from 'plural';

@provide()
@controller('/users')
export class UserController {
  @inject()
  userService: UserService;

  @get('/')
  async getUser(ctx): Promise<void> {
    ctx.body = plural('validate');
  }
}

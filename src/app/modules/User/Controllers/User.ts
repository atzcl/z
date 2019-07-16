import { controller, provide, get, Context } from 'midway';
import * as plural from 'plural';

@provide()
@controller('/users')
export class UserController {
  @get('/')
  async getUser(ctx: Context): Promise<void> {
    ctx.body = plural('validate');
  }
}

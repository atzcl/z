import { provide } from 'midway';
import { IUserOptions } from '@my_types/interface';

// import { UserModel } from '../models/typeorm_bak/user';

@provide('userService')
export class UserService {
  async getUser(options?: IUserOptions) {
    // return UserModel.findByIds([ 1 ]);
  }

  async store() {
    // return UserModel._updateById('879cdf72-f8fb-41e2-b80c-f7c362609ccb', { username: 'atzcl222' });
  }
}

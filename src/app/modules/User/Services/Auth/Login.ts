/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| UserLogin
|
*/

import { provide } from 'midway';

import { UserModel } from '../../Models/User';

import { BaseAuthService } from './BaseAuth';

@provide()
export class UserLoginService extends BaseAuthService {
  model() {
    return UserModel;
  }
}

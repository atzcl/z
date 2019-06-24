/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { BaseApplication, IWeChatRequestAndAccessTokenOptions } from '../Kernel/BaseApplication';
import { IWeChatRequestOptions } from '../Kernel/Request';

import { AccessToken } from './Auth/AccessToken';
import { Client as AuthClient } from './Auth/Client';
import { Client as AppCodeClient } from './AppCode/Client';
import { Encryptor } from './Encryptor';

export class MiniProgramApplication extends BaseApplication {
  auth: AuthClient;
  encryptor: Encryptor;
  appCode: AppCodeClient;

  constructor(options: IWeChatRequestOptions) {
    super(options, new AccessToken(options));
  }

  async init(appOptions: IWeChatRequestAndAccessTokenOptions) {
    this.auth = new AuthClient(appOptions);
    this.encryptor = new Encryptor();
    this.appCode = new AppCodeClient(appOptions);
  }
}

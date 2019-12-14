/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { BaseApplication, WeChatRequestAndAccessTokenOptions } from '../Kernel/BaseApplication';
import { WeChatRequestOptions } from '../Kernel/Request';

import { AccessToken } from './Auth/AccessToken';
import { Client as AuthClient } from './Auth/Client';
import { Client as AppCodeClient } from './AppCode/Client';
import { Encryptor } from './Encryptor';


export class MiniProgramApplication extends BaseApplication {
  auth!: AuthClient;

  encryptor!: Encryptor;

  appCode!: AppCodeClient;

  constructor(options: WeChatRequestOptions) {
    super(options, new AccessToken(options));
  }

  protected async init(appOptions: WeChatRequestAndAccessTokenOptions) {
    this.auth = new AuthClient(appOptions);
    this.encryptor = new Encryptor();
    this.appCode = new AppCodeClient(appOptions);
  }
}

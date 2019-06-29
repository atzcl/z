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
import { Server } from './Server/Server';
import { Client as Material } from './Material/Client';

export class OfficialAccountApplication extends BaseApplication {
  server: Server;

  material: Material;

  constructor(options: IWeChatRequestOptions) {
    super(options, new AccessToken(options));
  }

  protected async init(appOptions: IWeChatRequestAndAccessTokenOptions) {
    this.server = new Server(appOptions);

    this.material = new Material(appOptions);
  }
}

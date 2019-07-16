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
import { Server } from './Server/Server';
import { Client as Material } from './Material/Client';


export class OfficialAccountApplication extends BaseApplication {
  server!: Server;

  material!: Material;

  constructor(options: WeChatRequestOptions) {
    super(options, new AccessToken(options));
  }

  protected async init(appOptions: WeChatRequestAndAccessTokenOptions) {
    this.server = new Server(appOptions);

    this.material = new Material(appOptions);
  }
}

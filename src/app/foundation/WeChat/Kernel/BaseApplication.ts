/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { AccessToken } from './AccessToken';
import { IWeChatRequestOptions } from './Request';

export type IWeChatRequestAndAccessTokenOptions = IWeChatRequestOptions & { accessToken: AccessToken };

export class BaseApplication {
  accessToken: AccessToken;

  constructor(options: IWeChatRequestOptions, accessTokenInstance: AccessToken) {
    // 挂载 access_token
    this.accessToken = accessTokenInstance;

    // 组合 app 相关参数
    const appOptions = {
      ...options,
      accessToken: this.accessToken,
    };

    this.init(appOptions);
  }

  protected async init(options: IWeChatRequestAndAccessTokenOptions) {
    //
  }
}

/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { AccessToken } from './AccessToken';
import { WeChatRequestOptions } from './Request';


export type WeChatRequestAndAccessTokenOptions = WeChatRequestOptions & { accessToken: AccessToken, };

export class BaseApplication {
  accessToken: AccessToken;

  constructor(options: WeChatRequestOptions, accessTokenInstance: AccessToken) {
    // 挂载 access_token
    this.accessToken = accessTokenInstance;

    // 组合 app 相关参数
    const appOptions = {
      ...options,
      accessToken: this.accessToken,
    };

    this.init(appOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async init(options: WeChatRequestAndAccessTokenOptions) {
    //
  }
}

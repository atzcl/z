/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 小程序 access_token 处理
|
*/

import { AccessToken as BaseAccessToken } from '@/app/foundation/WeChat/Kernel/AccessToken';


export class AccessToken extends BaseAccessToken {
  endpointToGetToken = 'https://api.weixin.qq.com/cgi-bin/token';

  get getCredentials() {
    return {
      grant_type: 'client_credential',
      appid: this.config.mini_program.app_id,
      secret: this.config.mini_program.secret,
    };
  }
}

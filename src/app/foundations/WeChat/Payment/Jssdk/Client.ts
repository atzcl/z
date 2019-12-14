/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 生成支付 JS 配置
|
*/

import * as dayjs from 'dayjs';

import { BaseClient } from '../Kernel/BaseClient';
import { uniqId } from '../../Kernel/Utils';


export class Client extends BaseClient {
  /**
   * 生成 WeixinJSBridge 支付配置
   */
  async bridgeConfig(prepayId: string) {
    const { payment } = this.config;
    const params: any = {
      appId: payment.sub_appid || payment.app_id,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      timeStamp: '' + dayjs().unix(),
      nonceStr: uniqId(),
      package: `prepay_id=${prepayId}`,
      signType: 'MD5',
    };

    params.paySign = await this.generateSign(params, await this.app.getKey(''));

    return params;
  }

  /**
   * 生成 JSSDK 的 js 配置
   */
  async sdkConfig(prepayId: string) {
    const config: any = await this.bridgeConfig(prepayId);
    config.timestamp = config.timeStamp;
    delete config.timeStamp;

    return config;
  }

  async appConfig(prepayId: string) {
    //
  }

  async shareAddressConfig(prepayId: string) {
    //
  }
}

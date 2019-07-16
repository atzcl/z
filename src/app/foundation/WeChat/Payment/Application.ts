/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { BaseApplication } from '../Kernel/BaseApplication';
import { WeChatRequestOptions } from '../Kernel/Request';

import { Client as OrderClient } from './Order/Client';
import { Client as JssdkClient } from './Jssdk/Client';


export interface ConfigOptions {
  sandbox: boolean; // 沙箱模式
  app_id: string;
  mch_id: string;
  key: string; // API 密钥
  pfx: string; // 绝对路径
  notify_url: string; // 默认的订单回调地址
  spbill_create_ip: string; // IP 地址
}

export class PaymentApplication extends BaseApplication {
  order!: OrderClient;

  jssdk!: JssdkClient;

  constructor(options: WeChatRequestOptions) {
    options = {
      ...options,
      // 替换基础路径
      config: {
        ...options.config,
        base_uri: options.config.payment_base_uri,
      },
    };

    // 当前模块无需 accessToken
    super(options, null as any);
  }

  protected async init(appOptions: WeChatRequestOptions) {
    this.order = new OrderClient(appOptions);
    this.jssdk = new JssdkClient(appOptions);
  }
}

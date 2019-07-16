/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 获取沙箱模式的 key
|
*/

import { BaseClient } from '../Kernel/BaseClient';
import { md5 } from '../../Kernel/Utils';

// 不要再继承 BaseClient 了, 避免循环依赖
export class Client {
  baseClient: BaseClient;

  constructor(baseClient: BaseClient) {
    this.baseClient = baseClient;
  }

  async getCacheKey() {
    const config = this.baseClient.config.payment;

    return 'z.payment.sandbox.' + md5(config.app_id + config.mch_id);
  }

  async getKey() {
    const cache = await this.baseClient.cache.get(await this.getCacheKey());
    if (cache) {
      return cache;
    }

    const response = await this.baseClient.request('sandboxnew/pay/getsignkey');

    if (response.return_code === 'SUCCESS') {
      const sandboxSignkey = response.sandbox_signkey;
      this.baseClient.cache.set(await this.getCacheKey(), sandboxSignkey, 24 * 3600);

      return sandboxSignkey;
    }

    this.baseClient.abort(500, response.retmsg || response.return_msg);
  }
}

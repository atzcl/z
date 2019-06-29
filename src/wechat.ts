/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建 wechat 相关实例
|
*/

import {
  provide, init, plugin, config, scope, ScopeEnum, EggLogger, EggAppConfig, Application,
} from 'midway';
import CacheManager from '@/app/foundation/support/cache';
import { MiniProgramApplication } from '@/app/foundation/WeChat/MiniProgram/Application';
import { PaymentApplication } from '@/app/foundation/WeChat/Payment/Application';
import { OfficialAccountApplication } from '@/app/foundation/WeChat/OfficialAccount/Application';

@scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
@provide('wechat')
export class WeChat {
  @plugin('logger')
  logger: EggLogger;

  @config('wechat')
  config: EggAppConfig['wechat'];

  @plugin('redis')
  redis: Application['redis'];

  // 公众号实例
  officialAccount: OfficialAccountApplication;

  // 小程序实例
  miniProgram: MiniProgramApplication;

  // 支付实例
  payment: PaymentApplication;

  @init()
  connect() {
    const options = {
      config: this.config,
      logger: this.logger,
      cache: new CacheManager(this.redis, 'atzcl'),
    };

    // 公众号
    this.officialAccount = new OfficialAccountApplication(options);

    // 小程序
    this.miniProgram = new MiniProgramApplication(options);

    // 微信支付
    // 拼接绝对路径
    options.config.payment.pfx = __dirname + '/app/' + options.config.payment.pfx;
    this.payment = new PaymentApplication(options);
  }
}

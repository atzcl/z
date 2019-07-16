/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { EggLogger } from 'midway';
import { Cache as CacheManager } from '@my_foundation/Support/Cache';

import { ConfigOptions } from './Application';
import { Client as SandboxClient } from './Sandbox/Client';


export interface WeChatRequestOptions {
  cache: CacheManager;
  config: any;
  logger: EggLogger;
}

export class PaymentApplication {
  // 缓存实例
  cache: CacheManager;

  // 配置
  // todo: 后面可以拓展内部维护
  config: ConfigOptions;

  // 日志实例
  // todo: 后面可以拓展内部维护
  logger: EggLogger;

  sandbox: SandboxClient;

  constructor(options: WeChatRequestOptions, sandbox: SandboxClient) {
    const { config, cache, logger } = options;

    this.cache = cache;
    this.config = config.payment;
    this.logger = logger;
    this.sandbox = sandbox;
  }

  /**
   * @return bool
   */
  async inSandbox() {
    return Boolean(this.config.sandbox);
  }

  /**
   * @param string|null $endpoint
   *
   * @return string
   *
   * @throws \EasyWeChat\Kernel\Exceptions\InvalidArgumentException
   */
  async getKey(endpoint: string | null = null) {
    if (endpoint === 'sandboxnew/pay/getsignkey') {
      return this.config.key;
    }

    const key: string = await this.inSandbox() ? await this.sandbox.getKey() : this.config.key;

    if (! key) {
      this.abort(404, 'config key should not empty.');
    }

    if (key.length !== 32) {
      this.abort(404, `${key} should be 32 chars length.`);
    }

    return key;
  }

  /**
   * 抛出异常
   */
  abort(code: number, message: string = 'error') {
    const error: any = new Error(message);
    error.status = code;
    error.name = 'WeChatException';
    error.message = message;

    // 抛出验证异常给全局异常处理接管处理
    throw error;
  }

  /**
   * 判断是否携带错误属性
   *
   * @param res  curl 的 data 结果
   */
  async isError(res: any) {
    if (! res.errcode) {
      return;
    }

    await this.abort(422, `【 微信调用异常 】${res.errcode} ---> ${res.errmsg}`);
  }
}

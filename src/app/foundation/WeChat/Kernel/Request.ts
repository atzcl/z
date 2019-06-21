/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { EggLogger } from 'midway';
import { RequestOptions, request as Request } from 'urllib';
import CacheManager from '@my_foundation/support/cache';

export interface IWeChatRequestOptions {
  cache: CacheManager;
  config: any;
  logger: EggLogger;
}

export class BaseRequest {
  // 缓存实例
  cache: CacheManager;
  // 配置
  // todo: 后面可以拓展内部维护
  config: any;
  // 日志实例
  // todo: 后面可以拓展内部维护
  logger: EggLogger;

  constructor(options: IWeChatRequestOptions) {
    const { config, cache, logger } = options;

    this.cache = cache;
    this.config = config;
    this.logger = logger;
  }

  /**
   * 发送请求
   */
  async baseRequest(url: string, opt: RequestOptions = {}) {
    return Request(url, { dataType: 'json', ...opt });
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

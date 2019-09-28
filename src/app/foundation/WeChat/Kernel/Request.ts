/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 请求基类
|
| @see https://github.com/request/request
|
*/

import { EggLogger } from 'midway';
import * as Request from 'request';
import { Cache as CacheManager } from '@my_foundation/Support/Cache';

import { WeChatRequestException } from './Exceptions/WeChatRequestException';


export type RequestOptions = Request.CoreOptions & { params?: object, };

export interface WeChatRequestOptions {
  cache: CacheManager;
  config: {
    base_uri: string, // 基础 url
    open_platform_base_uri: string, // 微信开放平台
    payment_base_uri: string, // 微信支付
    open_work_base_uri: string, // 企业微信服务商
    work_base_uri: string, // 企业微信

    /**
     * 公众号
     */
    official_account: {
      app_id: string,
      secret: string,
      token: string,
      encoding_aes_key: string,
      oauth: {
        scopes: string,
        callback: string,
      },
    },

    /**
     * 小程序
     */
    mini_program: {
      app_id: string,
      secret: string,
      token: string,
      encoding_aes_key: string,
    },

    payment: {
      sandbox: boolean, // 沙箱模式
      app_id: string,
      mch_id: string,
      key: string, // API 密钥
      pfx: string, // 绝对路径
      notify_url: string, // 默认的订单回调地址
      spbill_create_ip: string, // IP 地址
      sub_mch_id: string,
      sub_appid: string,
    },
  };
  logger: EggLogger;
}

export class BaseRequest {
  // 缓存实例
  cache: WeChatRequestOptions['cache'];

  // 配置
  // todo: 后面可以拓展内部维护
  config: WeChatRequestOptions['config'];

  // 日志实例
  // todo: 后面可以拓展内部维护
  logger: WeChatRequestOptions['logger'];

  constructor(options: WeChatRequestOptions) {
    const { config, cache, logger } = options;

    this.cache = cache;
    this.config = config;
    this.logger = logger;
  }

  setConfig(config: WeChatRequestOptions['config']) {
    this.config = config;

    return this;
  }

  /**
   * 发送请求
   */
  baseRequest(url: string, opt: RequestOptions = {}, isAutoHandleError = true): Promise<any> {
    const options = {
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      timeout: 60000, // 60秒超时
      json: true,
      ...opt,
    };

    return new Promise((resolve, reject) => {
      Request(options, (error, response, body) => {
        if (error && Number(response.statusCode) !== 200) {
          isAutoHandleError ? this.abort(500, String(error)) : reject(error);

          return;
        }

        resolve(body);
      });
    });
  }

  /**
   * 抛出异常
   */
  abort(code: number, message = 'error') {
    throw new WeChatRequestException(code, message);
  }

  /**
   * 判断是否携带错误属性
   *
   * @param res  curl 的 data 结果
   */
  resolveBodyHasError(res: any) {
    if (res.errcode) {
      this.abort(res.errcode, res.errmsg);
    }
  }
}

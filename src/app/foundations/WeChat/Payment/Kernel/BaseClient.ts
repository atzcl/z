/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 微信的请求处理
|
*/

// eslint-disable-next-line import/no-extraneous-dependencies
import { RequestOptions } from 'urllib';
import * as fs from 'fs-extra';

import { BaseRequest, WeChatRequestOptions } from '../../Kernel/Request';
import {
  uniqId, md5, sha256, toQueryString, buildXML, parseXML,
} from '../../Kernel/Utils';
import { ConfigOptions } from '../Application';
import { PaymentApplication } from '../Payment';
import { Client as SandboxClient } from '../Sandbox/Client';


interface Response {
  return_code: string;
  return_msg: string;
  result_code: string;
  err_code_des: string;
}

export class BaseClient extends BaseRequest {
  /**
   * 微信 api 基础 url 前缀
   */
  baseUri: string | undefined;

  app: PaymentApplication;

  constructor(options: WeChatRequestOptions) {
    super(options);

    const sandbox = new SandboxClient(this);
    this.app = new PaymentApplication(options, sandbox);
  }

  // 额外的请求参数
  async prepends() {
    return {};
  }

  // eslint-disable-next-line max-params
  async request(
    endpoint: string,
    params: any = {},
    method: RequestOptions['method'] = 'POST',
    options: any = {},
    isUseCert?: false,
  ): Promise<any> {
    const config: ConfigOptions = this.config.payment;

    // 获取密钥
    const secretKey = await this.app.getKey(endpoint);

    // 拼接参数
    const newParams = await this.resolveParams(config, params);
    newParams.sign = await this.generateSign(newParams, secretKey, newParams.sign_type || 'MD5');

    // 合成请求参数
    const requestOptions = {
      method,
      data: buildXML(newParams),
      json: false,
      ...options,
    };

    // 是否需要证书
    if (isUseCert) {
      requestOptions.pfx = fs.readFileSync(config.pfx);
      requestOptions.passphrase = config.mch_id;
    }

    const response = await this.baseRequest(await this.requestUrl(endpoint), requestOptions);

    return this.handleResponse(response);
  }

  async requestRaw() {
    //
  }

  async safeRequest() {
    //
  }

  /**
   * 包装请求 url, 用于处理沙箱模式
   */
  async wrap(endpoint: string) {
    return await this.app.inSandbox() ? `sandboxnew/${endpoint}` : endpoint;
  }

  /**
   * 生成签名
   */
  async generateSign(params: any, secretKey: string, type: 'MD5' | 'HMAC-SHA256' = 'MD5') {
    const str = toQueryString(params) + '&key=' + secretKey;

    switch (type) {
      case 'MD5':
        return md5(str).toUpperCase();
      case 'HMAC-SHA256':
        return sha256(str, secretKey).toUpperCase();
    }
  }

  /**
   * 解析请求响应回来的数据，判断是否存在异常
   */
  private async handleResponse(response: { status: number, data: string, }) {
    if (response.status !== 200) {
      this.abort(500, '请求异常');
    }

    const result = (await parseXML(response.data)) as Response;
    if (result.return_code === 'FAIL') {
      this.abort(500, `${result.return_msg}`);
    }

    if (result.result_code === 'FAIL') {
      this.abort(500, `${result.err_code_des}`);
    }

    return result;
  }

  /**
   * 拼接请求参数
   */
  private async resolveParams(config: any, params: any) {
    const base = {
      mch_id: config.mch_id,
      nonce_str: uniqId(),
      sub_mch_id: '',
      sub_appid: '',
    };

    const newParams = {
      ...base,
      ...(await this.prepends()),
      ...params,
    };

    Object.keys(newParams).forEach((attr: string) => {
      if (! newParams[attr]) {
        delete newParams[attr];
      }
    });

    return newParams;
  }

  /**
   * 获取基础 url
   */
  private async requestUrl(url: string) {
    const baseUri = this.baseUri || this.config.base_uri;

    // 返回完整的请求 url
    return `${baseUri}${url}`;
  }
}

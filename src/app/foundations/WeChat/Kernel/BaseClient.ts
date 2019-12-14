/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 微信的请求处理
|
*/

import * as qs from 'qs';

import { BaseRequest, WeChatRequestOptions, RequestOptions } from './Request';
import { AccessToken } from './AccessToken';


export default class BaseClient extends BaseRequest {
  /**
   * 微信 api 基础 url 前缀
   */
  baseUri!: string;

  /**
   * accessToken 实例
   *
   * @type {AccessToken}
   */
  accessTokenInstance: AccessToken;

  constructor(options: WeChatRequestOptions & { accessToken: AccessToken, }) {
    super(options);

    // 挂载 accessToken 实例
    this.accessTokenInstance = options.accessToken;
  }

  /**
   * get 请求
   *
   * @param {string} url 请求 url
   * @param {object} options curl 请求配置
   */
  async httpGet(url: string, options: RequestOptions = {}) {
    const result = await this.baseRequest(await this.requestUrl(url, options.params));

    this.resolveBodyHasError(result);

    return result;
  }

  /**
   * post 请求
   *
   * @param url 请求 url
   * @param options curl 请求配置
   */
  async httpPost(url: string, data: any = {}, options: RequestOptions = {}) {
    const result = await this.baseRequest(
      await this.requestUrl(url, options.params),
      {
        method: 'POST',
        ...options,
        form: data,
      },
    );

    this.resolveBodyHasError(result);

    return result;
  }

  async httpUpload(url: string, formData = {}, options?: RequestOptions) {
    const result = await this.httpPost(url, {}, { ...(options || {}), formData });

    // eslint-disable-next-line no-console
    console.log(result);
  }

  async getAccessToken() {
    return this.accessTokenInstance.getToken();
  }

  async setAccessToken(accessToken: string) {
    this.accessTokenInstance.setToken(accessToken);

    return this;
  }

  /**
   * 获取基础 url
   */
  protected async requestUrl(url: string, params?: object) {
    const baseUri = this.baseUri || this.config.base_uri;

    // tslint:disable-next-line:variable-name
    const access_token = await this.getAccessToken();

    const query = qs.stringify({ access_token, ...(params || {}) });

    // 返回完整的请求 url
    return `${baseUri}${url}?${query}`;
  }
}

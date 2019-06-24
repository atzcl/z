/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 微信的请求处理
|
*/

import { RequestOptions } from 'urllib';
import { BaseRequest, IWeChatRequestOptions } from './Request';
import { AccessToken } from './AccessToken';

type newRequestOptions = RequestOptions & { returnFullInfo?: boolean };

export default class BaseClient extends BaseRequest {
  /**
   * 微信 api 基础 url 前缀
   */
  baseUri: string;

  /**
   * accessToken 实例
   *
   * @type {AccessToken}
   */
  accessTokenInstance: AccessToken;

  constructor(options: IWeChatRequestOptions & { accessToken: AccessToken }) {
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
  public async httpGet(url: string, data: any = {},  options?: newRequestOptions) {
    const result = await this.baseRequest(
      await this.requestUrl(url),
      {
        ...options,
        data: {
          access_token: await this.getAccessToken(),
          ...data,
        },
      },
    );

    // 判断是否返回错误
    await this.isError(result.data);

    return result.data;
  }

  /**
   * post 请求
   *
   * @param url 请求 url
   * @param options curl 请求配置
   */
  public async httpPost(url: string, data: any = {}, options?: newRequestOptions) {
    // tslint:disable-next-line:variable-name
    const access_token = await this.getAccessToken();

    const result = await this.baseRequest(
      `${await this.requestUrl(url)}?access_token=${access_token}`,
      {
        method: 'POST',
        contentType: 'json',
        ...options,
        data: {
          ...data,
        },
      },
    );

    // 判断是否返回错误
    await this.isError(result.data);

    return options && (options as any).returnFullInfo ? result : result.data;
  }

  async httpUpload() {
    //
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
  private async requestUrl(url: string) {
    const baseUri = this.baseUri || this.config.base_uri;

    // 返回完整的请求 url
    return `${baseUri}${url}`;
  }
}

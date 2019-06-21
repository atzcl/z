/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 获取小程序码
|
*/

import BaseClient from '../../Kernel/BaseClient';

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/getWXACodeUnlimit.html
 */
interface IOptional {
  width?: number;
  auto_color?: boolean;
  line_color?: { r: number, g: number, b: number };
  is_hyaline?: boolean;
}

const defaultOptions = {
  dataType: '',
  returnFullInfo: true,
};

export class Client extends BaseClient {
  /**
   * 获取小程序码，适用于需要的码数量较少的业务场景
   *
   * @param {string} path
   * @param {IOptional}  optional
   *
   * @return {Buffer}
   */
  async get(path: string, optional: IOptional = {}): Promise<Buffer> {
    const result = await this.httpPost('wxa/getwxacode', { path, ...optional }, defaultOptions);

    await this.hasError(result);

    return result.data;
  }

  /**
   * 获取小程序码，适用于需要的码数量极多的业务场景。通过该接口生成的小程序码，永久有效，数量暂无限制
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/getWXACodeUnlimit.html
   *
   * @param string scene
   * @param array  optional
   *
   * @return {Buffer}
   */
  async getUnlimit(scene: string, optional: IOptional & { page?: string } = {}): Promise<Buffer> {
    const result = await this.httpPost('wxa/getwxacodeunlimit', { scene, ...optional }, defaultOptions);

    await this.hasError(result);

    return result.data;
  }

  /**
   * 获取小程序二维码，适用于需要的码数量较少的业务场景
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/createWXAQRCode.html
   *
   * @param {string}   path
   * @param {number|null} width
   *
   * @return {Buffer}
   */
  async getQrCode(path: string, width: number | null = null): Promise<Buffer> {
    const result = await this.httpPost('cgi-bin/wxaapp/createwxaqrcode', { path, width }, defaultOptions);

    await this.hasError(result);

    return result.data;
  }

  /**
   * 处理异常
   *
   * @param {any} result 请求返回
   */
  async hasError(result) {
    const contentType = result.headers['content-type'];

    if (! contentType.includes('image')) {
      const errorInfo = JSON.parse(result.data.toString() || JSON.stringify({}));

      this.abort(500, `获取小程序码失败, ${errorInfo.errcode} ---> ${errorInfo.errmsg}`);
    }
  }
}

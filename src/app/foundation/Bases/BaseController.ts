/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 控制器基类
|
*/

import { BaseRequest } from './BaseRequest';

interface IApiToResponse {
  code: number;
  data: any;
  total: number;
  msg: string;
  time: number;
}

export class Controller extends BaseRequest {
  /**
   * @var {any} 返回的 data 数据
   */
  statusData: any;

  /**
   * @var {int} 返回的 code 状态码
   */
  statusCode: number = 200;

  /**
   * @var {string} 返回的 msg 提示
   */
  statusMessage: string = 'success';

  /**
   * @var {number} 总数
   */
  statusTotal: number | null = null;

  /**
   * 设置返回 data 数据
   *
   * @param {any} val 返回数据
   * @returns this
   */
  public setStatusData(val: any = null): this {
    this.statusData = val;

    return this;
  }

  /**
   * 设置返回 msg
   *
   * @param { string } val 提示语
   * @returns this
   */
  public setStatusMessage(val: string): this {
    this.statusMessage = val;

    return this;
  }

  /**
   * 设置返回 code
   *
   * @param {number} val 状态码
   */
  public setStatusCode (val: number): this {
    this.statusCode = val;

    return this;
  }

  /**
   * 设置返回 total
   *
   * @param {number} val 总数
   */
  public setStatusTotal(val: number): this {
    this.statusTotal = val;

    return this;
  }

  /**
   * 响应返回
   */
  public async toResponse() {
    // 组装返回格式
    const response = {
      code: this.statusCode,
      data: this.statusData || null,
      msg: this.statusMessage,
      time: Math.floor(new Date().getTime() / 1000),
    };

    // 如果有传入，那么就添加总页数的属性
    if (this.statusTotal !== null && this.statusTotal !== undefined) {
      (response as IApiToResponse).total = this.statusTotal;
    }

    // 响应返回
    this.ctx.response.body = response;
  }

  /**
   * 响应成功返回
   *
   * @param {string} message 返回的 msg 提示
   *
   * @returns {object} response
   */
  public async succeed(message: string = ''): Promise<void> {
    if (message) {
      this.setStatusMessage(message);
    }

    this.toResponse();
  }

  /**
   * 响应失败返回
   *
   * @param {string} message 错误提示
   * @param {number} code 状态码
   *
   * @returns {object} response
   */
  public async failed(message: string = 'error', code: number = 422): Promise<void> {
    await this.setStatusCode(code).setStatusMessage(message).toResponse();
  }

  /**
   * 因为有时候图片资源并没有上 cdn, 而这个时候，图片的路径只是相对路径，所以这个时候要补上对应域名
   *
   * @param {any} data 数据源
   * @param {string[]} 需要拼接的字段集合
   *
   * @returns {any}
   */
  async spliceFullUrlPath(data: any, fields: string[] = [ 'image' ]) {
    if (data && Array.isArray(data)) {
      for (const item of data) {
        for (const field of fields) {
          if (! (item[field] as string).includes('https://')) {
            item[field] = this.config.myApp.appUrl +  item[field];
          }
        }
      }
    }

    return data;
  }
}

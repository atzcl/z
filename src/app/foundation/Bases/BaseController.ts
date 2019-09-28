/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 控制器基类
|
*/

import { adminPrefix } from '@my_config/config.default';

import { BaseRequest } from './BaseRequest';


interface ApiToResponse {
  code: number;
  data: any;
  total: number;
  msg: string;
  time: number;
}

// 拼接 admin 的路由
export const getAdminRoute = (prefix: string) => `/${prefix}/${adminPrefix}`

export class Controller extends BaseRequest {
  /**
   * @var {any} 返回的 data 数据
   */
  statusData: any;

  /**
   * @var {number} 总数
   */
  statusTotal: number | undefined;

  /**
   * @var {int} 返回的 code 状态码
   */
  statusCode = 200;

  /**
   * @var {string} 返回的 msg 提示
   */
  statusMessage = 'success';

  /**
   * 设置返回 data 数据
   *
   * @param {any} val 返回数据
   * @returns this
   */
  setStatusData(val: any = null): this {
    this.statusData = val;

    return this;
  }

  /**
   * 设置返回 msg
   *
   * @param { string } val 提示语
   * @returns this
   */
  setStatusMessage(val: string): this {
    this.statusMessage = val;

    return this;
  }

  /**
   * 设置返回 code
   *
   * @param {number} val 状态码
   */
  setStatusCode(val: number): this {
    this.statusCode = val;

    return this;
  }

  /**
   * 设置返回 total
   *
   * @param {number} val 总数
   */
  setStatusTotal(val: number): this {
    this.statusTotal = Number(val);

    return this;
  }

  /**
   * 响应返回
   */
  async toResponse() {
    // 组装返回格式
    const response = {
      code: this.statusCode,
      data: this.statusData || null,
      msg: this.statusMessage,
      time: Math.floor(new Date().getTime() / 1000),
    };

    // 如果有传入，那么就添加总页数的属性
    if (typeof this.statusTotal === 'number') {
      (response as ApiToResponse).total = this.statusTotal;
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
  async succeed(message = ''): Promise<void> {
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
  async failed(message = 'error', code = 422): Promise<void> {
    await this.setStatusCode(code).setStatusMessage(message).toResponse();
  }
}

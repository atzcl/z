/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 模块 controller 基类
|
*/

import { Controller } from 'egg';

export default class BaseController extends Controller {
  /**
   * @var {Request} Context#request
   */
  get request () {
    return this.ctx.request;
  }

  /**
   * @var {any} Request 上的 body 数据
   */
  get getRequestBody () {
    return this.request.body;
  }

  /**
   * 重置 request 的 body
   */
  set setRequestBody (body: any) {
    this.request.body = body;
  }

  /**
   * @var {Response} Context#response
   */
  get response () {
    return this.ctx.response;
  }

  /**
   * @var {Foundation} Context#foundation
   */
  get foundation () {
    return this.ctx.foundation;
  }

  /**
   * @var {any} 返回的 data 数据
   */
  private statusData: any = null;

  /**
   * @var {int} 返回的 code 状态码
   */
  private statusCode: number = 200;

  /**
   * @var {string} 返回的 msg 提示
   */
  private statusMessage: string = 'success';

  /**
   * 设置返回 data 数据
   *
   * @param {any} val 返回数据
   * @returns this
   */
  public setStatusData (val: any): this {
    this.statusData = val;

    return this;
  }

  /**
   * 设置返回 msg
   *
   * @param { string } val 提示语
   * @returns this
   */
  public setStatusMessage (val: string): this {
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
   * 响应返回
   *
   * @param { number } total 如果是分页返回的话，应该加上 count 总页数数据
   */
  public async toResponse (total: number = 0) {
    // 组装返回格式
    const response = {
      code: this.statusCode,
      data: this.statusData,
      msg: this.statusMessage,
      time: Math.floor(new Date().getTime() / 1000),
    };

    // 如果有传入，那么就添加总页数的属性
    if (total > 0) {
      (response as ZApiToResponse).total = total;
    }

    // 响应返回
    this.ctx.response.body = response;
  }

  /**
   * 响应成功返回
   *
   * @param {any} data 返回的 data 值
   * @param {string} message 返回的 msg 提示
   * @returns {object} response
   */
  public async succeed (data: any = null, message: string = 'success'): Promise<void> {
    await this.setStatusData(data).setStatusMessage(message).toResponse();
  }

  /**
   * 响应失败返回
   *
   * @param {string} message 错误提示
   * @param {number} code 状态码
   * @returns {object} response
   */
  public async failed (message: string = 'error', code: number = 422): Promise<void> {
    await this.setStatusCode(code).setStatusMessage(message).toResponse();
  }
}

interface ZApiToResponse {
  code: number;
  data: any;
  total: number;
  msg: string;
  time: number;
}

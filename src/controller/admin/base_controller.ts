/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Admin 模块基类
|
*/

import { Controller } from 'egg'

export default class BaseController extends Controller {
  /**
   * @var {any} 返回的 data 数据
   */
  private statusData: any = null

  /**
   * @var {int} 返回的 code 状态码
   */
  private statusCode: number = 200

  /**
   * @var {string} 返回的 msg 提示
   */
  private statusMessage: string = 'success'

  /**
   * 
   * @param {any} val 返回数据
   * @returns this
   */
  public async setStatusData(val: any): Promise<void> {
    this.statusData = val
  }

  /**
   * 
   * @param { string } val 提示语
   * @returns this
   */
  public async setStatusMessage(val: string): Promise<void> {
    this.statusMessage = val
  }

  /**
   * 
   * @param {number} val 状态码
   */
  public async setStatusCode(val: number): Promise<void> {
    this.statusCode = val
  }

  /**
   * 响应返回
   *
   * @param { number } total 如果是分页返回的话，应该加上 count 总页数数据
   */
  public async toResponse(total: number = 0) {
    // 组装返回格式
    let response = {
      code: this.statusCode,
      data: this.statusData,
      msg: this.statusMessage,
      time: Date.now()
    }

    // 如果有传入，那么就添加总页数的属性
    if (total > 0) {
      (response as ZApiToResponse).total = total
    }

    // 响应返回
    this.ctx.response.body = response
  }

  /**
   * 响应返回
   *
   * @param {any} data 返回的 data 值
   * @param {string} message 返回的 msg 提示
   * @returns {object} response
   */
  public async succeed(data: any = null, message: string = 'success'): Promise<void> {
    await this.setStatusData(data)
    await this.setStatusMessage(message)
    this.toResponse()
  }

  /**
   * 
   * @param {string} message 错误提示 
   * @param {number} code 状态码
   * @returns {object} response
   */
  public async failed(message: string = 'error', code: number = 422): Promise<void> {
    await this.setStatusMessage(message)
    await this.setStatusCode(code)
    this.toResponse()
  }
}

interface ZApiToResponse {
  code:  number,
  data:  any,
  total: number,
  msg :  string,
  time:  number
}

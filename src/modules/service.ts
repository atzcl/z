/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 模块 controller 基类
|
*/

import { Service } from 'egg'

export default class BaseService extends Service {
  /**
   * @var {Request} Context#request
   */
  get request () {
    return this.ctx.request
  }

  /**
   * @var {any} Request 上的 body 数据
   */
  get getRequestBody () {
    return this.request.body
  }

  /**
   * 重置 request 的 body
   */
  set setRequestBody (body: any) {
    this.request.body = body
  }

  /**
   * @var {Response} Context#response
   */
  get response () {
    return this.ctx.response
  }

  /**
   * @var {Handlers} Context#handlers
   */
  get handlers () {
    return this.ctx.handlers
  }
}

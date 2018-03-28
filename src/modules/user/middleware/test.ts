/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 测试中间件
|
*/

import { Application, Context } from 'egg'

module.exports = (app: Application) => {
  return async (ctx: Context, next: Function) => {
    console.log('user 模块中间件')

    await next()
  }
}

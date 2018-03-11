/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理使用 jwt 验证
|
*/

import { Context } from 'egg'

module.exports = () => {
  /**
   * 该中间件无须验证的路由数组
   */
  const except: string[] = [
    '/admin/v1/login'
  ]

  return async (ctx: Context, next: Function) => {
    // 判断当前访问路径是否是无须验证的路由数组
    if (except.includes(ctx.path)) {
      await next()
    }
  }
}
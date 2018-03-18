/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理异常
|
*/

import { Context } from 'egg'

module.exports = () => {
  return async (ctx: Context, next: Function) => {
    try {
      // 无错误则直接放行
      await next()
    } catch (error) {
      // 状态码
      let statusCode = error.status || 500
      // 错误提示
      let statusMessage = error.message || 'error'

      // 异常处理 [ 后面增加 message 自定义吧 ]
      if (error.name === 'UnprocessableEntityError') {
        statusCode = 422
        try {
          statusMessage = `${error.message}: [${error.errors[0].field}] ${error.errors[0].message}`
        } catch (e) {
          statusMessage = error.message
        }
      }

      // egg-sequelize 的异常处理
      if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 422
        statusMessage = `数据库操作失败: ${error.errors[0].message}`
      }

      // 处理由 jwt 签发的 token 失效异常
      if (error.name === 'TokenExpiredError') {
        statusCode = 403
        statusMessage = 'token 已过期，请重新登录'
      }

      if (error.name === 'JsonWebTokenError') {
        statusCode = 422
        statusMessage = '非法的 token'
      }

      // todo: 实现邮件、微信告警

      // 响应返回
      ctx.body = {
        code: statusCode,
        data: null,
        msg: statusMessage,
        time: Math.floor(new Date().getTime() / 1000)
      }
    }
  }
}

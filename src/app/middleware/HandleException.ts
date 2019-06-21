/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 处理异常
|
*/

import { Context } from 'midway';

export default function exceptionsMiddleware() {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      // 无错误则直接放行
      await next();

      if (ctx.status === 404 && !ctx.body) {
        ctx.body = {
          code: 404,
          data: null,
          msg: '当前请求不存在',
          time: Math.floor(new Date().getTime() / 1000),
        };
      }
    } catch (error) {
      if (ctx.app.config.env === 'local') {
        ctx.logger.info('------------------------ exception ------------------------');
        ctx.logger.info(error);
        ctx.logger.info('------------------------ exception end ------------------------\n');
      }

      // 状态码
      let statusCode = error.status || 500;
      // 错误提示
      let statusMessage = error.message || 'error';

      // egg-sequelize 的异常处理
      if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 422;
        statusMessage = `数据库操作失败: ${error.errors[0].message}`;
      }

      // 处理由 jwt 签发的 token 失效异常
      if (error.name === 'TokenExpiredError') {
        statusCode = 403;
        statusMessage = 'token 已过期，请重新登录';
      }

      // 处理由 jwt 验证 token 非法异常
      if (error.name === 'JsonWebTokenError') {
        statusCode = 422;
        statusMessage = '非法的 token';
      }

      // 应用异常通知, 异步调用，不需要等待，避免阻塞
      // ctx.service.exceptions.handler(error);

      // 响应返回
      ctx.body = {
        code: statusCode,
        data: null,
        msg: statusMessage,
        time: Math.floor(new Date().getTime() / 1000),
      };
    }
  };
}

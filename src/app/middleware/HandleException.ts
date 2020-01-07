/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 处理异常
|
*/

import { Context } from 'midway';

import { CONTAINER_NAME, Queue } from '../foundations/Queue';


const exceptionNotify = async (ctx: Context, error: Error) => {
  const { myApp } = ctx.app.config;
  if (!myApp.exceptionNotify.enable) {
    return;
  }

  const queue = await ctx.requestContext.getAsync(CONTAINER_NAME) as Queue;

  queue.clients.dingtalk.dispatch(
    'exceptionNotify',
    {
      error: { name: error.name, message: error.message, stack: error.stack },
      config: {
        appName: myApp.appName,
        url: ctx.request.href,
        ip: ctx.ip,
        exceptionNotify: myApp.exceptionNotify,
      },
    },
  )
}


export default function exceptionsMiddleware() {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      // 无错误则直接放行
      await next();

      if (ctx.status === 404 && ! ctx.body) {
        ctx.helper.toResponse(404, null, '当前请求不存在');
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

      // 应用异常通知
      await exceptionNotify(ctx, error)

      // 响应返回
      ctx.helper.toResponse(statusCode, null, statusMessage);
    }
  };
}

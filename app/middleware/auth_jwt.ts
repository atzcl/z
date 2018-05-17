/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 处理使用 jwt 验证
|
*/

import { Application, Context } from 'egg';

export default function authJWTMiddleware (app: Application) {
  /**
   * 该中间件无须验证的路由数组
   */
  const except: string[] = [
    `/v1/${app.config.apps.adminRouter}/login`, // 后端登录
    `/v1/${app.config.apps.adminRouter}/register`, // 后端注册
  ];

  return async (ctx: Context, next: () => Promise<any>) => {
    // 判断当前访问路径是否是无须验证的路由数组
    if (except.includes(ctx.path)) {
      // 放行
      return next();
    }

    // 获取 header 携带的 authorization 头
    const getToken = ctx.get('authorization');
    // 判断是否有有携带 authorization 头
    if (getToken) {
      try {
        // 验证 token 是否合法有效，并将解密后的 sub 数据挂载到 request 的 body 的 jwt_sub 中，方便后续使用
        ctx.request.body.jwt_sub = await ctx.foundation.jwt.getSub(getToken.split(' ')[1]);

        // 放行
        return next();
      } catch (error) {
        //
      }
    }

    // 中断后续
    await ctx.helper.toResponse(ctx, 401, null, '请登录');
  };
}

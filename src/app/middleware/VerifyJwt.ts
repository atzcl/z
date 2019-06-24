/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| jwt 权鉴, 跟 user 模块的鉴权中间件一样，开多一个是为了能挂载到全局
|
| @see https://github.com/midwayjs/midway/issues/174
|
*/

import { Application, Context } from 'egg';

export default function authJWTMiddleware (app: Application) {
  return async (ctx: Context, next: () => Promise<any>) => {
    const { jwt, myApp } = ctx.app.config;
    const { adminPrefix } = myApp;

    /**
     * 该中间件无须验证的路由数组, 后面使用装饰器进行收集无需授权的路由
     */
    const except: string[] = [
      '/',
      '/empty_placeholder',
      `/users/${adminPrefix}/login`, // 后端登录
      '/users/mini_program/login',
      '/resources/uploads/mines',
      '/system_dashboard_app',

      '/slides',
      '/posters',
      '/companies',
      '/companies/login',
      '/companies/post_jobs',
      '/companies/post_jobs/news',
      '/cities',
      '/others',
      '/resources/uploads/image',
      '/companies/register',
      '/orders/notify',
    ];

    // 验证码、后台前端路由接管模块全部允许放行
    if ([ 'captchas', 'system_dashboard_app' ].includes(ctx.path.split('/')[1])) {
      return next();
    }

    // 指定动态路由放行
    const dynamicRoutes = [
      '/regions',
      '/companies/post_jobs/all',
      // '/companies/post_jobs/detail/',
      '/user_job_resumes/rec/',
      '/public/',
    ];

    if (dynamicRoutes.some((item: string) => ctx.path.indexOf(item) === 0)) {
      return next();
    }

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
        const token = getToken.split(' ')[1];

        /**
         * @desc 根据不同入口, 设置不同的 jwt secret 来进行 jwt 鉴权,
         *       这个不同入口的判断就是根据 url 来判断，当前约定，如果在 url 上面携带了指定的入口名称，那么就切换到对应的 jwt secret
         *       所以在设置路由的时候，应该避开这样关键词
         *
         * @example /users/login ---> 客户端入口，使用默认的 jwt secret 解签
         *          /users/admin/login ----> 管理后台入口，使用 jwt.adminSecret 解签
         */

        // 默认为初始化的 secret, 用于正常客户端入口
        let entryJwtSecret = jwt.secret;
        // 判断是否是后台用户
        if (ctx.path.split('/').includes(adminPrefix)) {
          entryJwtSecret = jwt.adminSecret;
        }

        // 验证 token 是否合法有效，并将解密后的 sub 数据挂载到 request 的 body 的 jwt_sub 中，方便后续使用
        ctx.request.body.jwtUserClaims = await ctx.helper.jwt({ secret: entryJwtSecret }).getCustomClaims(token);

        // 放行
        return next();
      } catch (error) {
        //
      }
    }

    // 中断后续
    await ctx.abort(401, '请登录');
  };
}

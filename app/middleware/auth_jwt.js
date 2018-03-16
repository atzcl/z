"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理使用 jwt 验证
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    /**
     * 该中间件无须验证的路由数组
     */
    const except = [
        // 后端登录
        `/v1/${app.config.myApps.adminRouter}/login`,
        `/v1/${app.config.myApps.adminRouter}/register`,
    ];
    return async (ctx, next) => {
        // 判断当前访问路径是否是无须验证的路由数组
        if (except.includes(ctx.path)) {
            await next();
            return;
        }
        ctx.body = {
            code: 401,
            data: null,
            msg: '请先登录'
        };
    };
};

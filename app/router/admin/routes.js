"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Admin 模块路由
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    const { controller, router, middleware } = app;
    // 定义路由前缀并设置使用的中间件
    const adminV1Router = router.namespace('/admin/v1', middleware.authJwt());
    // 登录路由
    adminV1Router.get('/login', controller.admin.auth.login.index);
};

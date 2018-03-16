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
    const adminV1Router = router.namespace(`/v1/${app.config.myApps.adminRouter}`, middleware.authJwt(app));
    // 登录
    adminV1Router.post('/login', controller.admin.auth.login.login);
    // 注册
    adminV1Router.post('/register', controller.admin.auth.register.register);
};

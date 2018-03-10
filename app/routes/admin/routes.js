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
    const { controller, router } = app;
    // 登录路由
    router.get('/login', controller.admin.auth.login.index);
};

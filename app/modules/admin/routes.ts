/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| Admin 模块路由
|
*/

import { Application } from 'egg';

module.exports = (app: Application) => {
  const { router, middleware } = app;
  const { admin } = app.modules.controller;

  // 定义路由前缀并设置使用的中间件
  const adminV1Router = router.namespace(`/v1/${app.config.apps.adminRouter}/`, (middleware as any).authJwt(app));
  // 登录
  adminV1Router.post('admin.login', 'login', admin.userAdmin.login);
  // 注册
  // adminV1Router.post('admin.register', 'register', admin.userAdmin)
};

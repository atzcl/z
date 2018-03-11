/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Admin 模块路由
|
*/

import { Application } from 'egg'

module.exports = (app: Application) => {
  const { controller, router, middleware } = app

  // 定义路由前缀并设置使用的中间件
  const adminV1Router = router.namespace('/admin/v1', (middleware as any).authJwt())
  // 登录路由
  adminV1Router.get('/login', controller.admin.auth.login.index)
}
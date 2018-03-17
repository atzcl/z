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
  const adminV1Router = router.namespace(`/v1/${app.config.myApps.adminRouter}`, (middleware as any).authJwt(app))
  // 登录
  adminV1Router.post('/login', controller.admin.auth.login.login)
  // 注册
  adminV1Router.post('/register', controller.admin.auth.register.register)
}

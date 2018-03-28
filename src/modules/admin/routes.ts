/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Admin 模块路由
|
*/

import { Application } from 'egg'

module.exports = (app: Application) => {
  // 我也不想弄这么多层，，，知识有限，暂时找不到其他方法 [ 为了智能提示 ]
  const { modules, router, middleware } = app
  const { controller } = modules
  const { admin } = controller

  // 定义路由前缀并设置使用的中间件
  const adminV1Router = router.namespace(`/v1/${app.config.myApps.adminRouter}`, (middleware as any).authJwt(app))
  // 登录
  adminV1Router.post('admin.login', '/login', admin.login.login)
  // 注册
  adminV1Router.post('admin.register', '/register', admin.register.register)
}

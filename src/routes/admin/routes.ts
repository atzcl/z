/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Admin 模块路由
|
*/

import { Application } from 'egg'

module.exports = (app: Application) => {
  const { controller, router } = app

  // 登录路由
  router.get('/login', controller.admin.auth.login.index)
}
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Home 模块路由
|
*/

import { Application } from 'egg'

module.exports = (app: Application) => {
  const { controller, router } = app

  router.get('/test', controller.home.index.index)
}
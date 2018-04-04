/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 模块路由入口
|
*/

import { Application } from 'egg'

module.exports = (app: Application) => {
  const { controller, router } = app

  // 首页
  router.get('/', controller.index.index)

  /*****************************  模块路由 ********************************/

  // 模块基础路径
  const moduleBaseDir = '../modules'

  // wechat 模块
  require(`${moduleBaseDir}/wechat/routes`)(app)

  // user 模块
  require(`${moduleBaseDir}/user/routes`)(app)

  // admin 模块
  require(`${moduleBaseDir}/admin/routes`)(app)

  // socket.io
  require('../io/routes')(app)
}

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
  const wechatRouter = router.namespace('/wechat', (middleware as any).xmlToJson(app))
  // 微信入口
  wechatRouter.all('/', controller.wechat.index.index)
  //
  wechatRouter.get('wechat.login', '/login_qr_code', controller.wechat.login.qrCode)
}

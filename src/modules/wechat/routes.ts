/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| WeChat 模块路由
|
*/

import { Application } from 'egg'

module.exports = (app: Application) => {
  // 我也不想弄这么多层，，，知识有限，暂时找不到其他方法 [ 为了智能提示 ]
  const { router, middleware, modules } = app
  const { controller } = modules
  const { wechat } = controller

  // 定义路由前缀并设置使用的中间件
  const wechatRouter = router.namespace('/wechat', (middleware as any).xmlToJson(app))

  // 微信入口
  wechatRouter.all('/', wechat.index.index)
}

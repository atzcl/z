/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 路由入口: 加载模块相应路由及定义不属于模块的路由
|
*/

import { Application } from 'egg'

export default (app: Application) => {
  // 从 Application 中获取 controller、router 对象
  const { controller, router } = app

  // 首页
  router.get('/', controller.home.index.index)
}

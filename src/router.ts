/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 路由入口: 加载模块相应路由及定义不属于模块的路由
|
*/

import { Application } from 'egg'

// 遍历目录包
const rd = require('rd')

export default (app: Application) => {
  // 从 Application 中获取 controller、router 对象
  const { controller, router } = app

  // 首页
  router.get('/', controller.home.index.index)

  // 异步载入模块路由文件
  rd.each(`${app.baseDir}/app/routes`, (file: string, s: object, next: Function) => {
    try {
      // 判断是否是 js 文件
      if ((/\.js$/).test(file)) {
        // 加载并传入 app 对象供其使用
        require(file)(app)
      }
      
      // 进行下一个
      next()
    } catch (error) {
      // 这里采取打印错误是因为中间件的异常处理加载晚于 route 加载，导致无法拦截处理异常。
      console.log(error)
    }
  }, (e: Error) => {
    // 如果存在报错，那么就打印报错结果
    if (e) {
      console.log(`自定义加载路由文件出错: ${e}`)
    }
  })
}
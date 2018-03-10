import { Application } from 'egg'

const path = require('path')
const HANDLERS = 'handlers'

/**
 * 自定义 Loader 加载拓展目录
 *
 * @desc https://eggjs.org/zh-cn/advanced/loader.html
 */
module.exports = (app: Application) => {
  loadHandlers(app)
}

/**
 * 加载 handlers 目录的所有 js，并注入 ctx 中
 *
 * @param {Application} app Application 对象
 */
async function loadHandlers(app: Application) {
  // 获取所有的 loadUnit
  const handlePaths = app.loader.getLoadUnits().map((unit: any) => path.join(unit.path, `app/${HANDLERS}`))

  app.loader.loadToContext(handlePaths, HANDLERS, {
    // service 需要继承 app.Service，所以要拿到 app 参数
    // 设置 call 在加载时会调用函数返回 UserService
    call: true
  });
}

// async function loadToApp(app: Application) {
//   // 获取 handlers 路径
//   const handleDir = path.join(app.baseDir, 'app/handlers')
//   // 加载 handlers 下的文件到 app 中
//   app.loader.loadToApp(handleDir, HANDLERS, {
//     inject: app, // 传入 Application 对象
//     // caseStyle: 'upper', // 文件的转换规则: lower （首字母小写的驼峰写法）
//     // ignore: '', // 忽略指定文件
//   })
// }

import { Application } from 'egg'

const path = require('path')

/**
 * 自定义 Loader 加载拓展目录
 *
 * @desc https://eggjs.org/zh-cn/advanced/loader.html
 */
module.exports = (app: Application) => {
  // 加载所有处理第三方业务
  loadCustomizeCtx('handlers', app)
  // 加载所有验证文件
  loadCustomizeCtx('validates', app, 'validateRule')
  // 加载所有 Repository 层文件
  loadCustomizeCtx('repositories', app, 'repository')
}

/**
 * 加载指定目录的所有 js，并注入 ctx 中 （懒加载）
 *
 * @param {Application} app Application 对象
 */
function loadCustomizeCtx(loadPath: string, app: Application, customizeCtx: string = '') {
  // 获取所有的 loadUnit
  const handlePaths = app.loader.getLoadUnits().map((unit: any) => path.join(unit.path, `app/${loadPath}`))

  app.loader.loadToContext(handlePaths, customizeCtx === '' ? loadPath : customizeCtx, {
    // 设置 call 在加载时会调用函数返回相对应的处理
    call: true
  })
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

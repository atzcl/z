const path = require('path')
import { forEach } from 'lodash'
import { Application } from 'egg'

/**
 * 自定义 Loader 加载拓展目录
 *
 * @desc https://eggjs.org/zh-cn/advanced/loader.html
 */
module.exports = (app: Application) => {
  // 目录公共路径
  let unitBaseDir = `${app.config.baseDir}/app`

  // 加载自定义模块
  loadModules(app)
  // 加载所有处理第三方业务
  loadCustomizeFile(app, `${unitBaseDir}/handlers`, 'handlers')
  // 加载所有验证文件
  loadCustomizeFile(app, `${unitBaseDir}/validates`, 'validateRule')
  // 加载所有 Repository 层文件
  loadCustomizeFile(app, `${unitBaseDir}/repositories`, 'repository')
}

/**
 * 加载指定目录的所有 js，并注入 ctx 中 （懒加载）
 *
 * @param {Application} app Application 对象
 * @param {string|string[]} loadPath 加载文件路径
 * @param {sting} target 挂载的名称
 * @param {string} method 加载的 loader 方法
 */
function loadCustomizeFile (
  app: Application, loadPath: string | string[], target: string, method: string = 'loadToContext'
) {
  app.loader[method](loadPath, target)
}

/**
 * 加载所有功能模块
 *
 * @param {Application} app egg Application 对象
 */
function loadModules (app: Application) {
  // let servicesPath: string[] = []
  // let repositoryPath: string[] = []
  // let validatesPath: string[] = []

  // 目录公共路径
  let unitBaseDir = `${app.config.baseDir}/app`

  // 加载 modules 下的所有功能模块
  forEach(app.config.myApps.modules_list, value => {
    // Config
    loadModuleConfig(app, value)
    // Controller
    loadModuleController(app, value)
    // Middleware
    loadModuleMiddleware(app, value)
    // Service
    loadCustomizeFile(app, `${unitBaseDir}/modules/${value}/services`, `${value}Service`)
    // Repository
    loadCustomizeFile(app, `${unitBaseDir}/modules/${value}/modulesRepository`, `${value}Repository`)
    // Validate
    loadCustomizeFile(app, `${unitBaseDir}/modules/${value}/modulesValidateRule`, `${value}ValidateRule`)
  })
}

/**
 * 加载单个模块的 controller
 *
 * @param {Application} app egg 的 Application 对象
 * @param {string} name 模块名称
 * @returns {void}
 */
function loadModuleController (app: Application, name: string) {
  (app as any).modules.controller[name] = {}
  app.loader.loadController({
    directory: app.loader.getLoadUnits().map((unit: any) => path.join(
      unit.path, `app/modules/${name}/controllers`)
    ),
    target: (app as any).modules.controller[name]
  })
}

/**
 * 加载单个模块的 middleware
 *
 * @param {Application} app egg 的 Application 对象
 * @param {string} name 模块名称
 * @returns {void}
 */
function loadModuleMiddleware (app: Application, name: string) {
  (app as any).modules.middleware[name] = {}
  new app.loader.FileLoader({
    directory: app.loader.getLoadUnits().map((unit: any) => path.join(unit.path, `app/modules/${name}/middleware`)),
    target: (app as any).modules.middleware[name],
    inject: app
  }).load()
}

function loadModuleConfig (app: Application, name: string) {
  (app as any).modules.config[name] = app.loader.loadFile(`${app.config.baseDir}/app/modules/${name}/config/app.js`)
}

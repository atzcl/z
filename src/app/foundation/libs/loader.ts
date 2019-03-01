/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 Loader 加载拓展目录
|
*/

import { Application } from 'midway';
import * as nodePath from 'path';
import * as fs from 'fs';

/**
 * @desc https://eggjs.org/zh-cn/advanced/loader.html
 */
export default function loader(app: Application) {
  // 加载自定义模块
  loadModules(app);
}

/**
 * 加载所有功能模块
 *
 * @param {Application} app egg Application 对象
 */
function loadModules (app: Application) {
  // 获取多模块的根路径
  const modulesDirectory = nodePath.resolve(app.config.baseDir, 'app/modules');

  // 按照约定，遍历获取多模块文件夹下的一级目录名称作为模块名称
  // todo: 后面还应该拓展禁用等功能
  fs.readdir(modulesDirectory, (error, files: string[]) => {
    if (error) {
      // todo: 抛出加载异常
      return;
    }

    files.forEach((name) => {
      // 加载指定模块的 Middleware
      // loadModuleMiddleware(app, modulesDirectory, name);
      // 加载指定模块的 Controller
      loadModuleController(app, modulesDirectory, name);
    });
  });
}

/**
 * 加载单个模块的 controller
 *
 * @param {Application} app egg 的 Application 对象
 * @param {string} modulesDirectory 模块目录路径
 * @param {string} name 模块名称
 *
 * @returns {void}
 */
function loadModuleController (app: Application, modulesDirectory: string, name: string) {
  // todo： 后面需要解决命名冲突的问题
  app.loader.loadController({
    directory: `${modulesDirectory}/${name}/controllers`,
  });
}

/**
 * 加载单个模块的 middleware
 *
 * @param {Application} app egg 的 Application 对象
 * @param {string} name 模块名称
 * @returns {void}
 */
// function loadModuleMiddleware (app: Application, modulesDirectory: string, name: string) {
//   app.modules.middleware[name] = {};
//   new app.loader.FileLoader({
//     directory: `${modulesDirectory}/${name}/middlewares`,
//     target: app.modules.middleware[name],
//     inject: app,
//   }).load();
// }

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
/**
 * 自定义 Loader 加载拓展目录
 *
 * @desc https://eggjs.org/zh-cn/advanced/loader.html
 */
module.exports = (app) => {
    // 加载所有处理第三方业务
    loadCustomizeCtx('handlers', app);
    // 加载工具类文件，并挂载在 app 上
    loadCustomizeApp('extend/utils', app, 'utils');
    // 加载所有验证文件
    loadCustomizeCtx('validates', app, 'validateRule');
    // 加载所有 Repository 层文件
    loadCustomizeCtx('repositories', app, 'repository');
};
/**
 * 加载指定目录的所有 js，并注入 ctx 中 （懒加载）
 *
 * @param {string} loadPath 加载文件路径
 * @param {Application} app Application 对象
 * @param {sting} customizeCtx 挂载的名称
 */
function loadCustomizeCtx(loadPath, app, customizeCtx = '') {
    // 载入配置
    const opt = {
        call: true,
        override: true,
        caseStyle: 'lower',
        directory: app.loader.getLoadUnits().map((unit) => path.join(unit.path, `app/${loadPath}`)),
    };
    app.loader.loadToContext(opt.directory, customizeCtx === '' ? loadPath : customizeCtx, opt);
}
/**
 * 加载指定目录的所有 js，并注入 app 中
 *
 * @param {string} loadPath 加载文件路径
 * @param {Application} app Application 对象
 * @param {sting} customizeCtx 挂载的名称
 */
async function loadCustomizeApp(loadPath, app, customizeCtx = '') {
    // 加载配置
    const opt = {
        call: true,
        override: true,
        caseStyle: 'lower',
        directory: app.loader.getLoadUnits().map((unit) => path.join(unit.path, `app/${loadPath}`)),
    };
    // 挂载在 app 对象中
    app.loader.loadToApp(opt.directory, customizeCtx === '' ? loadPath : customizeCtx, opt);
}

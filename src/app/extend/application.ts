/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 application
|
*/

import { Application } from 'midway';

const modulesSymbol = Symbol('Application#modules');

const extendApplication = {
  /**
   * 当前 ctx 的 Application 对象, 主要是为了能避免使用 (this as any) 的写法
   *
   * @return {Application}
   */
  get self(): Application {
    return this as any;
  },

  /**
   * 创建 modules 对象，并挂载到 app 对象中
   *
   * @returns void
   */
  get modules(): Application {
    if (! (this as any)[modulesSymbol]) {
      Object.defineProperty(this, modulesSymbol, {
        value: {
          config: {},
          controller: {},
          middleware: {},
        },
        writable: false,
        configurable: false,
      });
    }

    return (this as any)[modulesSymbol];
  },

  /**
   * 比较指定字符串的第一位是否相等
   *
   * @param {string} str 要截取的字符
   * @param {string} compare 比较的值
   */
  firstCharacterHasequal(str: string, compare: string = '') {
    return str && str.substr(0, 1) !== compare;
  },

  /**
   * 保证路径的完整
   *
   * @param {string} path 需要确保的路径
   */
  ensurePathComplete(path: string = '') {
    if (this.firstCharacterHasequal(path, '/')) {
      path = `/${path}`;
    }

    return path;
  },

  /**
   * 获取 app 目录路径
   *
   * @param {string} path 需要拼接的路径
   *
   * @returns {string}
   */
  appPath(root: string = '', path: string = '') {
    const full = this.ensurePathComplete(root) + this.ensurePathComplete(path);

    return `${this.self.baseDir}/app${full}`;
  },

  /**
   * 获取 app 目录下的 public 目录路径
   *
   * @param {string} path 需要拼接的路径
   *
   * @returns {string}
   */
  publicPath(path: string = '') {
    return this.appPath('public', path);
  },

  /**
   * 获取 app 目录下的 public 目录路径
   *
   * @param {string} path 需要拼接的路径
   *
   * @returns {string}
   */
  modulesPath(path: string = '') {
    return this.appPath('modules', path);
  },
};

export default extendApplication;

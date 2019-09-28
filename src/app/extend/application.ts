/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 application
|
*/

import { Application } from 'midway';
import { Cache as CacheClient } from '@app/foundation/Support/Cache';


const CACHE_SYMBOL = Symbol('Application#cache');

const extendApplication = {
  /**
   * 当前 ctx 的 Application 对象, 主要是为了能避免使用 (this as any) 的写法
   *
   * @return {Application}
   */
  get self(): Application & { [CACHE_SYMBOL]: CacheClient, } {
    return this as any;
  },

  /**
   * 缓存
   *
   * todo: 当前只简单地返回缓存实例
   * todo: 待实现缓存底层的类型切换、快捷的缓存操作
   */
  get cache(): CacheClient {
    if (! this.self[CACHE_SYMBOL]) {
      this.self[CACHE_SYMBOL] = new CacheClient(
        this.self.redis,
        this.self.config.myApp.appName || 'atzcl',
      );
    }

    return this.self[CACHE_SYMBOL];
  },

  /**
   * 比较指定字符串的第一位是否相等
   *
   * @param {string} str 要截取的字符
   * @param {string} compare 比较的值
   */
  firstCharacterHasequal(str: string, compare = '') {
    return str && str.substr(0, 1) !== compare;
  },

  /**
   * 保证路径的完整
   *
   * @param {string} path 需要确保的路径
   */
  ensurePathComplete(path = '') {
    return this.firstCharacterHasequal(path, '/') ? `/${path}` : path;
  },

  /**
   * 获取 app 目录路径
   *
   * @param {string} path 需要拼接的路径
   *
   * @returns {string}
   */
  appPath(root = '', path = '') {
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
  publicPath(path = '') {
    return this.appPath('public', path);
  },

  /**
   * 获取 app 目录下的 public 目录路径
   *
   * @param {string} path 需要拼接的路径
   *
   * @returns {string}
   */
  modulesPath(path = '') {
    return this.appPath('modules', path);
  },
};

export default extendApplication;
